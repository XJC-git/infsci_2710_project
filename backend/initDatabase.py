# 文档注释
# 1. 在运行该文档前，请在mySQL中创建一个名为finalProject的database
# 2. 在运行该文档前，请将'mysql://root:YourPassword@localhost:3306/finalProject'中的‘YourPassword’改为您mySQL数据库的登录密码

from flask import Flask
from flask_sqlalchemy import  SQLAlchemy
import pymysql

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:YourPassword@localhost:3306/finalProject'
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