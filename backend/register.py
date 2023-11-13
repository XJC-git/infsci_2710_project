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

# 防止数据库连接超时
SQLALCHEMY_POOL_SIZE = 20
SQLALCHEMY_POOL_TIMEOUT = 300

@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == "POST":
        # 获取表格
        User = initDatabase.Users

        user_id = request.args.get("user_id")
        password = request.args.get("password")
        password_1 = request.args.get("password_1")

        # 查询
        existed_user = User.query.get(user_id)

        if len(user_id) == 0:
            flash('Please input the username')
            return "Please input the username", 512
        if len(password_1) == 0:
            flash('Please input the password')
            return "Please input the password", 513

        # 连接数据库版本测试
        if existed_user:
            flash('User id existed!')
            return "User id existed!", 514
        elif password_1 == password:
            flash('Account created successfully.')
            # 存入数据
            user = User(user_id=user_id, password=password)
            db.session.add(user)
            db.session.commit()
            return "Account created successfully.", 200
        elif password != password_1:
            flash('The passwords entered twice are inconsistent.')
            return "The passwords entered twice are inconsistent.", 515


        #return render_template("register.html")


@app.route('/register/customer/<customer_id>', methods=['GET','POST'])
def customer_register(customer_id):
    if request.method == "POST":
        Customer = initDatabase.Customers

        address = request.args.get("address")
        if len(address) == 0:
            return "Please input the address!",512
        state = request.args.get("state")
        if len(state) == 0:
            return "Please input the state",512
        city = request.args.get("city")
        if len(city) == 0:
            return "Please input the city",512
        zip_code = request.args.get("zip_code")
        if zip_code == 0:
            return "Please input the zip code",512
        kind = request.args.get("kind")
        if len(kind) == 0:
            return "Please input the kind",512
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
        return "Account created successfully.",200


@app.route('/register/salesperson/<salesperson_id>', methods=["POST"])
def salesperson_register(salesperson_id):
    if request.method == "POST":
        Salesperson = initDatabase.Salespersons
        Store = initDatabase.Store

        name = request.args.get("name")
        if len(name) == 0:
            return "Please input the name",512
        email = request.args.get("email")
        if len(email) == 0:
            return "Please input the email",512
        job_title = request.args.get("job_title")
        if len(job_title) == 0:
            return "Please input the job title",512
        store_assigned = request.args.get("store_assigned")
        if store_assigned == 0:
            return "Please input the store assigned",512
        salary = request.args.get("salary")
        if salary == 0:
            return "Please input the salary",512
        state = request.args.get("state")
        if len(state) == 0:
            return "Please input the state",512
        city = request.args.get("city")
        if len(city) == 0:
            return "Please input the city",512
        address = request.args.get("address")
        if len(address) == 0:
            return "Please input the address",512
        zip_code = request.args.get("zip_code")
        if zip_code == 0:
            return "Please input the zip code",512

        # 判断store是否已经存在
        store_exist = Store.query.get(store_assigned)

        if not store_exist:
            flash("Store doesn't exist")
            return "Store doesn't exist",513

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
        return "salesperson create successfully",200


@app.route('/register/store', methods=["POST"])
def store_register():
    if request.method == "POST":
        Store = initDatabase.Store
        Region = initDatabase.Region

        store_id = request.args.get("store_id")
        if store_id == 0:
            return "Please input store id",512
        address = request.args.get("address")
        if len(address) == 0:
            return "Please input the address",512
        state = request.args.get("state")
        if len(state) == 0:
            return "Please input the state",512
        city = request.args.get("city")
        if len(city) == 0:
            return "Please input the city",512
        manager = request.args.get("manager")
        if len(manager) == 0:
            return "Please input the manager",512
        number_of_salesperson = request.args.get("salesperson")
        if number_of_salesperson == 0:
            return "Please input the number of salesperson",512
        region = request.args.get("region")
        if region == 0:
            return "Please input the region",512

        # 判断region是否已经存在
        region_exist = Region.query.get(region)

        if not region_exist:
            flash("region doesn't exist")
            return "region doesn't exist",513

        # 判断store_id是否重复
        store_repeated = Store.query.get(store_id)

        if store_repeated:
            flash("store id existed")
            return "store id existed",514

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
        return "store create successfully",200


@app.route('/register/region', methods=["POST"])
def register_region():
    if request.method == "POST":
        Region = initDatabase.Region

        region_id = request.args.get("region_id")
        if region_id == 0:
            return "Please input region id",512
        region_name = request.args.get("region_name")
        if len(region_name) == 0:
            return "Please input region name",512
        region_manager = request.args.get("region_manager")
        if len(region_manager) == 0:
            return "Please input region manager",512

        # 判断region_id是否重复
        region_repeated = Region.query.get(region_id)

        if region_repeated:
            flash("region id existed")
            return "region id existed",513

        region = Region(region_id=region_id,
                        region_name=region_name,
                        region_manager=region_manager)
        db.session.add(region)
        db.session.commit()
        flash("region create successfully")
        return "region create successfully",200


@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == "POST":
        # 获取表格
        User = initDatabase.Users
        user_id_input = request.args.get("user_id")
        password_input = request.args.get("password")

        # 获取数据库中数据
        user_id = User.query.get(user_id_input)

        if not user_id:
            flash("Account doesn't exist")
            return "Account doesn't exist",512
        else:
            password = User.query.get(user_id_input).password
            if password_input == password:
                flash('Account login successfully')
                return "Account login successfully",200
            else:
                flash('Password incorrect')
                return "Password incorrect",513


if __name__ == '__main__':
    app.run()
