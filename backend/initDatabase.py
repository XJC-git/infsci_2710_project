# 文档注释
# 在运行该文档前，请将在db_Info文档中填写您关于database的相关信息

from flask import Flask
from flask_sqlalchemy import  SQLAlchemy
import pymysql
import dbInfo

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://" + dbInfo.user_name + ":" + dbInfo.password + "@" + dbInfo.host + "/" + dbInfo.db_name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Users(db.Model):
    # 定义表名
    __tablename__ = 'user'
    # 定义表字段
    user_id = db.Column(db.String(48), primary_key=True)
    password = db.Column(db.String(48))
    user_type = db.Column(db.String(48))


class Customers(db.Model):
    # 定义表名
    __tablename__ = 'customers'
    # 定义表字段
    customer_id = db.Column(db.String(48), db.ForeignKey("user.user_id"), primary_key=True)
    address = db.Column(db.String(48))
    state = db.Column(db.String(48))
    city = db.Column(db.String(48))
    zip_code = db.Column(db.Integer)
    kind = db.Column(db.String(12))


class Region(db.Model):
    # 定义表名
    __tablename__ = 'region'
    # 定义表字段
    region_id = db.Column(db.Integer, primary_key=True)
    region_name = db.Column(db.String(48))
    region_manager = db.Column(db.String(48))

class Store(db.Model):
    # 定义表名
    __tablename__ = 'store'
    # 定义表字段
    store_id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(48))
    state = db.Column(db.String(48))
    city = db.Column(db.String(48))
    manager = db.Column(db.String(48))
    number_of_salesperson = db.Column(db.Integer)
    region = db.Column(db.Integer, db.ForeignKey("region.region_id"))


class Salespersons(db.Model):
    # 定义表名
    __tablename__ = 'salespersons'
    # 定义表字段
    salesperson_id = db.Column(db.String(48), db.ForeignKey("user.user_id"), primary_key=True)
    name = db.Column(db.String(48))
    email = db.Column(db.String(48))
    job_title = db.Column(db.String(48))
    store_assigned = db.Column(db.Integer, db.ForeignKey("store.store_id"))
    salary = db.Column(db.Float)
    state = db.Column(db.String(48))
    city = db.Column(db.String(48))
    address = db.Column(db.String(48))
    zip_code = db.Column(db.Integer)


class Products(db.Model):
    # 定义表名
    __tablename__ = 'products'
    # 定义表字段
    product_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(48))
    category = db.Column(db.String(48))
    price = db.Column(db.Float)
    inventory_amount = db.Column(db.Integer)
    avatar = db.Column(db.String(150))


class Transactions(db.Model):
    # 定义表名
    __tablename__ = 'transactions'
    # 定义表字段
    transaction_id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    salesperson_id = db.Column(db.String(48), db.ForeignKey("salespersons.salesperson_id"))
    customer_id = db.Column(db.String(48), db.ForeignKey("customers.customer_id"))


class Sub_Transactions(db.Model):
    # 定义表名
    __tablename__ = 'sub_transactions'
    # 定义表字段
    sub_transaction_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"))
    transaction_id = db.Column(db.Integer, db.ForeignKey("transactions.transaction_id"))
    quantity = db.Column(db.Integer)



class Home_Customers_Details(db.Model):
    # 定义表名
    __tablename__ = 'home_customers'
    # 定义表字段
    customer_id = db.Column(db.String(48), db.ForeignKey("customers.customer_id"), primary_key=True)
    marriage_status = db.Column(db.Boolean)
    gender = db.Column(db.String(24))
    age = db.Column(db.Integer)


class Business_Customer_Details(db.Model):
    # 定义表名
    __tablename__ = 'business_customers'
    # 定义表字段
    customer_id = db.Column(db.String(48), db.ForeignKey("customers.customer_id"), primary_key=True)
    company_name = db.Column(db.String(48))
    business_category = db.Column(db.String(48))
    company_income = db.Column(db.Float)


def init_db():
    db.drop_all()
    db.create_all()

if __name__ == '__main__':
    # 删除数据库，保障测试运行的时候每次都运行的新数据库
    init_db()
