# 文档注释：
# 1. 在运行该文档前，请先运行initDatabase.py以为数据库创建数据表
# 2. 在运行该文档前，请将在db_Info文档中填写您关于database的相关信息


from flask import Flask, render_template, request, flash, jsonify
from flask_sqlalchemy import  SQLAlchemy
import initDatabase
import dbInfo
from sqlalchemy.orm.session import  make_transient

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://" + dbInfo.user_name + ":" + dbInfo.password + "@" + dbInfo.host + "/" + dbInfo.db_name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.secret_key='kdjklfjkd87384hjdhjh'

# 防止数据库连接超时
SQLALCHEMY_POOL_SIZE = 20
SQLALCHEMY_POOL_TIMEOUT = 300


@app.route('/delete/product', methods=['GET','POST'])
def delete_product():
    if request.method == "GET":
        # 获取表格
        Product = initDatabase.Products

        all_product = Product.query.all()

        return jsonify({'all_product':all_product}), 200
    if request.method == "POST":
        # 获取表格
        Product = initDatabase.Products
        # 获取前端返回的id
        product_id = request.args.get("product_id")

        # 查看该product是否存在
        product_existed = Product.query.get(product_id)
        if not product_existed:
            return "The product doesn't exist", 512

        # 如果存在，删除
        try:
            delete_statement = "DELETE FROM products WHERE product_id = " + str(product_id)
            db.session.execute(delete_statement)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return f"false: {str(e)}", 513

        return "The product is deleted correctly", 200


@app.route('/delete/sub_transaction',methods=['GET','POST'])
def delete_sub_transaction():
    if request.method == "GET":
        # 要和transactions联合
        try:
            query_statement = "SELECT * FROM sub_transactions JOIN transactions ON sub_transactions.transaction_id = transactions.transaction_id"
            all_transactions = db.engine.execute(query_statement)
        except Exception as e:
            return f"false: {str(e)}", 512

        return jsonify({"all_transactions":all_transactions}), 200

    if request.method == "POST":
        # 获取表
        Sub_Transaction = initDatabase.Sub_Transactions

        # 向前端获取sub_transaction_id
        sub_transaction_id = request.args.get("sub_transaction_id")

        # 判断该订单是否存在
        sub_transaction_existed = Sub_Transaction.query.get(sub_transaction_id)
        if not sub_transaction_existed:
            return "the transaction not existed", 513

        # 如果存在，开始删除
        # 先判断该子订单是否是最后一个子订单，如果是，则连同主订单一起删除
        # 获取主订单id
        transaction_id = sub_transaction_existed.transaction_id
        # 获取计数
        count = Sub_Transaction.query.filter_by(transaction_id=transaction_id).count()
        # 删除子订单
        delete_query = "DELETE FROM sub_transactions WHERE sub_transaction_id = " + str(sub_transaction_id)
        db.session.execute(delete_query)
        # 如果计数是1，删除主订单
        if count == 1:
            delete_query_2 = "DELETE FROM transactions WHERE transaction_id = " + str(transaction_id)
            db.session.execute(delete_query_2)
        db.session.commit()
        return "delete correctly", 200


@app.route('/abc',methods=['GET','POST'])
def abc():
    if request.method == "GET":
        statement = "DELETE FROM products WHERE product_id = " + str(1)
        try:
            db.session.execute(statement)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return f"false: {str(e)}"
    return "ok"


if __name__ == '__main__':
    app.run()
