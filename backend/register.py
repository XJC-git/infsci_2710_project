from flask import Flask, render_template, request, flash, session
from flask_sqlalchemy import SQLAlchemy
import pymysql

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:YourPassword@localhost:3306/finalProject'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.secret_key = 'kdjklfjkd87384hjdhjh'


@app.route('/register', methods=['GET', 'POST'])
def register():
    if (request.method == "GET"):
        return render_template("register.html")
    else:
        user_id = request.form.get("user_id")
        password = request.form.get("password")
        password_1 = request.form.get("password_1")
        session['1'] = user_id
        session['2'] = password
        # 未连接数据库版本测试
        if password_1 == password:
            flash('Account created successfully')
        elif password != password_1:
            flash('The passwords entered twice are inconsistent')

        return render_template("register.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    if (request.method == "GET"):
        return render_template("login.html")
    else:
        user_id_input = request.form.get("user_id")
        password_input = request.form.get("password")

        if user_id_input == session['1'] and password_input == session['2']:
            flash('Account login successfully')
        elif password_input != session['2']:
            flash('Password incorrect')
        else:
            flash("Account doesn't exit")
        return render_template("login.html")


if __name__ == '__main__':
    app.run()
