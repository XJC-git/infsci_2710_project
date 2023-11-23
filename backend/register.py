# 文档注释：
# 1. 在运行该文档前，请先运行initDatabase.py以为数据库创建数据表
# 2. 在运行该文档前，请将在db_Info文档中填写您关于database的相关信息


from flask import Flask, render_template, request, flash, jsonify
from flask_sqlalchemy import  SQLAlchemy
import initDatabase
import dbInfo
import json
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://" + dbInfo.user_name + ":" + dbInfo.password + "@" + dbInfo.host + "/" + dbInfo.db_name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.secret_key='kdjklfjkd87384hjdhjh'

# 防止数据库连接超时
SQLALCHEMY_POOL_SIZE = 500
SQLALCHEMY_POOL_TIMEOUT = 5000


@app.route('/query/product', methods=['GET'])
def query_product():
    if request.method == "GET":
        # 获取表格
        Product = initDatabase.Products

        all_product = Product.query.all()

        product_dict = {'product_id': all_product.product_id, 'name': all_product.name,
                        'category': all_product.category, 'price': all_product.price,
                        'inventory_amount': all_product.inventory_amount}

        return jsonify(product_dict), 200


@app.route('/query/sub_transaction', methods=['GET'])
def query_sub_transaction():
    if request.method == "GET":
        # 要和transactions联合
        try:
            query_statement = "SELECT * FROM sub_transactions JOIN transactions ON sub_transactions.transaction_id = transactions.transaction_id"
            all_transactions = db.engine.execute(query_statement)
        except Exception as e:
            return f"false: {str(e)}", 512

        transactions_dict = {'transaction_id':all_transactions.transaction_id, 'date':all_transactions.date,
                             'salesperson_id':all_transactions.salesperson_id, 'customer_id':all_transactions.customer_id,
                             'sub_transaction_id':all_transactions.sub_transaction_id, 'product_id':all_transactions.product_id,
                             'quantity':all_transactions.quantity}

        return jsonify(transactions_dict), 200


@app.route('/query/productID', methods=['POST'])
def query_productID():
    if request.method == "POST":
        # 获取表格
        product_id = request.args.get("product_id")

        # 根据id查找
        query_statement = "SELECT * FROM products WHERE product_id = " + str(product_id)
        product_result = db.session.execute(query_statement)
        if not product_result:
            db.session.remove()
            return "Product doesn't existed", 512

        # 将查询结果封装成字典
        product_dicts = []
        for temp in product_result:
            product_dict = {'product_id': temp.product_id, 'name': temp.name,
                            'category': temp.category, 'price': temp.price,
                            'inventory_amount': temp.inventory_amount}
            product_dicts.append(product_dict)

        db.session.remove()
        return json.dumps(product_dicts), 200


if __name__ == '__main__':
    app.run()
