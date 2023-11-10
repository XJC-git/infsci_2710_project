# 文档注释：
# 1. 在运行该文档前，请先运行initDatabase.py以为数据库创建数据表
# 2. 在运行该文档前，请将在db_Info文档中填写您关于database的相关信息


from flask import Flask, render_template, request, flash
from flask_sqlalchemy import  SQLAlchemy
import initDatabase
import dbInfo

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://" + dbInfo.user_name + ":" + dbInfo.password + "@" + dbInfo.host + "/" + dbInfo.db_name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.secret_key='kdjklfjkd87384hjdhjh'

@app.route('/register', methods = ['GET','POST'])
def register():
    if (request.method == "GET"):
        return render_template("register.html")
    else:
        # 获取表格
        User = initDatabase.Users

        user_id = request.form.get("user_id")
        password = request.form.get("password")
        password_1 = request.form.get("password_1")

        # 查询
        existed_user = User.query.get(user_id)

        # 连接数据库版本测试
        if existed_user:
            flash('User id existed!')
            return 406
        elif password_1 == password:
            flash('Account created successfully.')
            # 存入数据
            user = User(user_id=user_id, password=password)
            db.session.add(user)
            db.session.commit()
            return 200
        elif password != password_1:
            flash('The passwords entered twice are inconsistent.')
            return 405


        #return render_template("register.html")


@app.route('/login', methods = ['GET','POST'])
def login():
    if (request.method == "GET"):
        return render_template("login.html")
    else:
        # 获取表格
        User = initDatabase.Users
        user_id_input = request.args.get("user_id")
        password_input = request.form.get("password")

        # 获取数据库中数据
        user_id = User.query.get(user_id_input)

        if not user_id:
            flash("Account doesn't exit")
            return 405
        else:
            password = User.query.get(user_id_input).password
            if password_input == password:
                flash('Account login successfully')
                return 200
            else:
                flash('Password incorrect')
                return 406

        #return render_template("login.html")


if __name__ == '__main__':
    app.run()
