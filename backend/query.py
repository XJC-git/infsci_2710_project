# 文档注释：
# 1. 在运行该文档前，请先运行initDatabase.py以为数据库创建数据表
# 2. 在运行该文档前，请将在db_Info文档中填写您关于database的相关信息


from flask import Flask, render_template, request, flash, jsonify
from flask_sqlalchemy import  SQLAlchemy
import initDatabase
import dbInfo
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://" + dbInfo.user_name + ":" + dbInfo.password + "@" + dbInfo.host + "/" + dbInfo.db_name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.secret_key='kdjklfjkd87384hjdhjh'

# 防止数据库连接超时
SQLALCHEMY_POOL_SIZE = 20
SQLALCHEMY_POOL_TIMEOUT = 300


@app.route('/query/product', methods=['GET'])
def query_product():
    if request.method == "GET":
        # 获取表格
        Product = initDatabase.Products

        all_product = Product.query.all()

        return jsonify({'all_product':all_product}), 200


@app.route('/query/sub_transaction', methods=['GET'])
def query_sub_transaction():
    if request.method == "GET":
        # 要和transactions联合
        try:
            query_statement = "SELECT * FROM sub_transactions JOIN transactions ON sub_transactions.transaction_id = transactions.transaction_id"
            all_transactions = db.engine.execute(query_statement)
        except Exception as e:
            return f"false: {str(e)}", 512

        return jsonify({"all_transactions":all_transactions}), 200


if __name__ == '__main__':
    app.run()