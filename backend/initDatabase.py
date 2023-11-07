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

class User(db.Model):
    # 定义表名
    __tablename__ = 'user'
    # 定义表字段
    user_id = db.Column(db.String(48), primary_key=True)
    password = db.Column(db.String(48))



def init_db():
    db.drop_all()
    db.create_all()

if __name__ == '__main__':
    # 删除数据库，保障测试运行的时候每次都运行的新数据库
    init_db()
