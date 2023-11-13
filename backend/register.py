# 文档注释：
# 1. 在运行该文档前，请先运行initDatabase.py以为数据库创建数据表
# 2. 在运行该文档前，请将在db_Info文档中填写您关于database的相关信息


from flask import Flask, render_template, request, flash, make_response
from flask_sqlalchemy import  SQLAlchemy
import initDatabase
import dbInfo

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://" + dbInfo.user_name + ":" + dbInfo.password + "@" + dbInfo.host + "/" + dbInfo.db_name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.secret_key='kdjklfjkd87384hjdhjh'

@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == "POST":
        # 获取表格
        User = initDatabase.Users

        user_id = request.args.get("username")
        password = request.args.get("password")
        password_1 = request.args.get("password_1")

        # 查询
        existed_user = User.query.get(user_id)

        if len(user_id) == 0:
            flash('Please input the username')
            return make_response(407)
        if len(password_1) == 0:
            flash('Please input the password')
            return make_response(408)

        # 连接数据库版本测试
        if existed_user:
            flash('User id existed!')
            return make_response(406)
        elif password_1 == password:
            flash('Account created successfully.')
            # 存入数据
            user = User(user_id=user_id, password=password)
            db.session.add(user)
            db.session.commit()
            return 'success',200
        elif password != password_1:
            flash('The passwords entered twice are inconsistent.')
            return make_response(405)

        #return render_template("register.html")


@app.route('/register/customer/<customer_id>', methods=['GET','POST'])
def customer_register(customer_id):
    if request.method == "POST":
        Customer = initDatabase.Customers

        address = request.args.get("address")
        state = request.args.get("state")
        city = request.args.get("city")
        zip_code = request.args.get("zip_code")
        kind = request.args.get("kind")
        customer_id = customer_id
        flash("Account created successfully.")
        customer = Customer(customer_id=customer_id,
                            address=address,
                            state=state,
                            city=city,
                            zip_code=zip_code,
                            kind=kind)
        db.session.add(customer)
        db.session.commit()
        return 200


@app.route('/register/salesperson/<salesperson_id>', methods=["POST"])
def salesperson_register(salesperson_id):
    if request.method == "POST":
        Salesperson = initDatabase.Salespersons
        Store = initDatabase.Store

        name = request.args.get("name")
        email = request.args.get("email")
        job_title = request.args.get("job_title")
        store_assigned = request.args.get("store_assigned")
        salary = request.args.get("salary")
        state = request.args.get("state")
        city = request.args.get("city")
        address = request.args.get("address")
        zip_code = request.args.get("zip_code")

        # 判断store是否已经存在
        store_exist = Store.query.get(store_assigned)

        if not store_exist:
            flash("Store doesn't exist")
            return 405

        salesperson = Salesperson(salesperson_id=salesperson_id,
                                  name=name,
                                  email=email,
                                  job_title=job_title,
                                  store_assigned=store_assigned,
                                  salary=salary,
                                  state=state,
                                  city=city,
                                  address=address,
                                  zip_code=zip_code)

        db.session.add(salesperson)
        db.session.commit()
        flash("salesperson create successfully")
        return 200


@app.route('/register/store', methods=["POST"])
def store_register():
    if request.method == "POST":
        Store = initDatabase.Store
        Region = initDatabase.Region

        store_id = request.args.get("store_id")
        address = request.args.get("address")
        state = request.args.get("state")
        city = request.args.get("city")
        manager = request.args.get("manager")
        number_of_salesperson = request.args.get("salesperson")
        region = request.args.get("region")

        # 判断region是否已经存在
        region_exist = Region.query.get(region)

        if not region_exist:
            flash("region doesn't exist")
            return 405

        # 判断store_id是否重复
        store_repeated = Store.query.get(store_id)

        if store_repeated:
            flash("store id existed")
            return 406

        store = Store(store_id=store_id,
                      address=address,
                      state=state,
                      city=city,
                      manager=manager,
                      number_of_salesperson=number_of_salesperson,
                      region=region)
        db.session.add(store)
        db.session.commit()
        flash("store create successfully")
        return 200


@app.route('/register/region', methods=["POST"])
def register_region():
    if request.method == "POST":
        Region = initDatabase.Region

        region_id = request.args.get("region_id")
        region_name = request.args.get("region_name")
        region_manager = request.args.get("region_manager")

        # 判断region_id是否重复
        region_repeated = Region.query.get(region_id)

        if region_repeated:
            flash("region id existed")
            return 405

        region = Region(region_id=region_id,
                        region_name=region_name,
                        region_manager=region_manager)
        db.session.add(region)
        db.session.commit()
        flash("region create successfully")
        return 200


@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == "GET":
        return render_template("login.html")
    else:
        # 获取表格
        User = initDatabase.Users
        user_id_input = request.args.get("user_id")
        password_input = request.args.get("password")

        # 获取数据库中数据
        user_id = User.query.get(user_id_input)

        if not user_id:
            flash("Account doesn't exist")
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
