# 文档注释：
# 1. 在运行该文档前，请先运行initDatabase.py以为数据库创建数据表
# 2. 在运行该文档前，请将在db_Info文档中填写您关于database的相关信息


from flask import Flask, request, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
import initDatabase
import dbInfo
from datetime import datetime
import json

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
        user_id = request.args.get("user_id")
        password = request.args.get("password")
        password_1 = request.args.get("password_1")
        user_type = request.args.get("user_type")

        # 查询
        query_statement = "SELECT * FROM user WHERE user_id = '" + str(user_id) + "'"
        existed_user = db.session.execute(query_statement)

        if len(user_id) == 0:
            flash('Please input the username')
            db.session.remove()
            return "Please input the username", 512
        if len(password_1) == 0:
            flash('Please input the password')
            db.session.remove()
            return "Please input the password", 513

        # 连接数据库版本测试
        if existed_user:
            flash('User id existed!')
            db.session.remove()
            return "User id existed!", 514
        elif password_1 == password:
            flash('Account created successfully.')
            # 存入数据
            insert_query = ("INSERT INTO user " +
                            "VALUES('" + str(user_id) + "', '" + str(password) + "', '" +
                            str(user_type) + "')")
            db.session.execute(insert_query)
            db.session.commit()
            db.session.remove()
            return "Account created successfully.", 200
        elif password != password_1:
            flash('The passwords entered twice are inconsistent.')
            db.session.remove()
            return "The passwords entered twice are inconsistent.", 515


@app.route('/register/customer/<customer_id>', methods=['GET','POST'])
def customer_register(customer_id):

    if request.method == "POST":
        address = request.args.get("address")
        if len(address) == 0:
            db.session.remove()
            return "Please input the address!",512
        state = request.args.get("state")
        if len(state) == 0:
            db.session.remove()
            return "Please input the state",512
        city = request.args.get("city")
        if len(city) == 0:
            db.session.remove()
            return "Please input the city",512
        zip_code = request.args.get("zip_code")
        if zip_code == 0:
            db.session.remove()
            return "Please input the zip code",512
        kind = request.args.get("kind")
        if len(kind) == 0:
            db.session.remove()
            return "Please input the kind",512

        flash("Account created successfully.")

        # 导入
        insert_statement = ("INSERT INTO customers " +
                            "VALUES('" + str(customer_id) + "', '" + str(address) + "', '" +
                            str(state) + "', '" + str(city) + "', " + str(zip_code) + ", '" +
                            str(kind) + "')")
        db.session.execute(insert_statement)
        db.session.commit()
        db.session.remove()
        return "Account created successfully.",200


@app.route('/register/customer/<customer_id>/business', methods=['POST'])
def business_register(customer_id):
    if request.method == "POST":
        company_name = request.args.get("company_name")
        # 如果为空，报错
        if len(company_name) == 0:
            return "Please input the company name", 512
        business_category = request.args.get("business_category")
        if len(business_category) == 0:
            return "Please input the business category", 512
        company_income = request.args.get("company_income")
        if company_income == 0:
            return "Please input the company income", 512

        # 导入数据库
        insert_query = ("INSERT INTO business_customers " +
                        "VALUES('" + str(customer_id) + "', '"
                        + str(company_name) + "', '" +
                        str(business_category) + "', " +
                        str(company_income) + ")")

        db.session.execute(insert_query)
        db.session.commit()
        return "business customer register correctly", 200


@app.route('/register/customer/<customer_id>/home', methods=['POST'])
def home_customer(customer_id):
    if request.method == "POST":
        marriage_status = request.args.get("marriage_status")
        gender = request.args.get("gender")
        if len(gender) == 0:
            return "Please input the gender", 512
        age = request.args.get("age")
        if age == 0:
            return "Please input the age", 512

        # 导入数据库
        insert_query = ("INSERT INTO home_customers " +
                        "VALUES('" + str(customer_id) + "', " + str(marriage_status) + ", '" +
                        str(gender) + "', " + str(age) + ")")
        db.session.execute(insert_query)
        db.session.commit()
        return "home customer register correctly", 200


@app.route('/register/salesperson/<salesperson_id>', methods=["POST"])
def salesperson_register(salesperson_id):
    if request.method == "POST":
        name = request.args.get("name")
        if len(name) == 0:
            db.session.remove()
            return "Please input the name",512
        email = request.args.get("email")
        if len(email) == 0:
            db.session.remove()
            return "Please input the email",512
        job_title = request.args.get("job_title")
        if len(job_title) == 0:
            db.session.remove()
            return "Please input the job title",512
        store_assigned = request.args.get("store_assigned")
        if store_assigned == 0:
            db.session.remove()
            return "Please input the store assigned",512
        salary = request.args.get("salary")
        if salary == 0:
            db.session.remove()
            return "Please input the salary",512
        state = request.args.get("state")
        if len(state) == 0:
            db.session.remove()
            return "Please input the state",512
        city = request.args.get("city")
        if len(city) == 0:
            db.session.remove()
            return "Please input the city",512
        address = request.args.get("address")
        if len(address) == 0:
            db.session.remove()
            return "Please input the address",512
        zip_code = request.args.get("zip_code")
        if zip_code == 0:
            db.session.remove()
            return "Please input the zip code",512

        # 判断store是否已经存在
        query_statement = "SELECT * FROM store WHERE store_id = " + str(store_assigned)
        store_existed = db.session.execute(query_statement)

        if not store_existed:
            flash("Store doesn't exist")
            db.session.remove()
            return "Store doesn't exist",513

        # 导入salesperson
        insert_statement = ("INSERT INTO salespersons " +
                            "VALUES('" + str(salesperson_id) + "', '" + str(name) + "', '" +
                            str(email) + "', '" + str(job_title) + "', " + str(store_assigned) + ", " +
                            str(salary) + ", '" + str(state) + "', '" + str(city) + "', '" +
                            str(address) + "', " + str(zip_code) + ")")

        db.session.execute(insert_statement)
        db.session.commit()
        flash("salesperson create successfully")
        db.session.remove()
        return "salesperson create successfully",200


@app.route('/register/store', methods=["POST"])
def store_register():
    if request.method == "POST":
        store_id = request.args.get("store_id")
        if store_id == 0:
            db.session.remove()
            return "Please input store id",512
        address = request.args.get("address")
        if len(address) == 0:
            db.session.remove()
            return "Please input the address",512
        state = request.args.get("state")
        if len(state) == 0:
            db.session.remove()
            return "Please input the state",512
        city = request.args.get("city")
        if len(city) == 0:
            db.session.remove()
            return "Please input the city",512
        manager = request.args.get("manager")
        if len(manager) == 0:
            db.session.remove()
            return "Please input the manager",512
        number_of_salesperson = request.args.get("salesperson")
        if number_of_salesperson == 0:
            db.session.remove()
            return "Please input the number of salesperson",512
        region = request.args.get("region")
        if region == 0:
            db.session.remove()
            return "Please input the region",512

        # 判断region是否已经存在
        query_statement = "SELECT * FROM region WHERE region_id = " + str(region)
        region_existed = db.session.execute(query_statement)

        if not region_existed:
            flash("region doesn't exist")
            db.session.remove()
            return "region doesn't exist",513

        # 判断store_id是否重复
        query_statement_2 = "SELECT * FROM store WHERE store_id = " + str(store_id)
        store_existed = db.session.execute(query_statement_2)

        if store_existed:
            flash("store id existed")
            db.session.remove()
            return "store id existed",514

        # 导入store
        insert_statement = ("INSERT INTO store " +
                            "VALUES(" + str(store_id) + ", '" + str(address) + "', '" +
                            str(state) + "', '" + str(city) + "', '" + str(manager) + "', " +
                            str(number_of_salesperson) + ", " + str(region) + ")")

        db.session.execute(insert_statement)
        db.session.commit()
        flash("store create successfully")
        db.session.remove()
        return "store create successfully",200


@app.route('/register/region', methods=["POST"])
def register_region():
    if request.method == "POST":
        region_id = request.args.get("region_id")
        if region_id == 0:
            db.session.remove()
            return "Please input region id",512
        region_name = request.args.get("region_name")
        if len(region_name) == 0:
            db.session.remove()
            return "Please input region name",512
        region_manager = request.args.get("region_manager")
        if len(region_manager) == 0:
            db.session.remove()
            return "Please input region manager",512

        # 判断region_id是否重复
        query_statement = "SELECT * FROM region WHERE region_id = " + str(region_id)
        region_existed = db.session.execute(query_statement)

        if region_existed:
            flash("region id existed")
            db.session.remove()
            return "region id existed",513

        # 导入region数据
        insert_statement = ("INSERT INTO region " +
                            "VALUES(" + str(region_id) + ", '" + str(region_name) + "', '" +
                            str(region_manager) + "')")

        db.session.execute(insert_statement)
        db.session.commit()
        flash("region create successfully")
        db.session.remove()
        return "region create successfully",200


@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == "POST":
        # 获取表格
        user_id_input = request.args.get("user_id")
        password_input = request.args.get("password")

        # 获取数据库中数据
        query_statement = "SELECT * FROM users WHERE user_id = '" + str(user_id_input) + "'"
        user_existed = db.session.execute(query_statement)

        if user_existed.rowcount == 0:
            flash("Account doesn't exist")
            db.session.remove()
            return "Account doesn't exist",512
        else:
            # 查找密码
            user_get = next(user_existed)
            password = user_get.password

            if password_input == password:
                flash('Account login successfully')
                db.session.remove()
                return "Account login successfully",200
            else:
                flash('Password incorrect')
                db.session.remove()
                return "Password incorrect",513


@app.route('/transaction', methods=['POST','GET'])
def transaction():
    if request.method == "POST":
        # 获取数据
        date = request.args.get("date")
        if len(date) == 0:
            db.session.remove()
            return "Please input date", 512

        # 将日期的str转为date格式
        date_date = datetime.strptime(date, "%Y-%m-%d").date()

        salesperson_id = request.args.get("salesperson_id")
        if len(salesperson_id) == 0:
            db.session.remove()
            return "Please input salesperson id", 512
        customer_id = request.args.get("customer_id")
        if len(customer_id) == 0:
            db.session.remove()
            return "Please input customer id", 512

        # 判断用户和售货员是否存在
        query_statement = "SELECT * FROM customers WHERE customer_id = '" + str(customer_id) + "'"
        customer_existed = db.session.execute(query_statement)

        query_statement_2 = "SELECT * FROM salespersons WHERE salesperson_id = '" + str(salesperson_id) + "'"
        salesperson_existed = db.session.execute(query_statement_2)

        if not customer_existed:
            db.session.remove()
            return "The customer doesn't exist", 513
        if not salesperson_existed:
            db.session.remove()
            return "The salesperson doesn't exist", 514

        # 生成订单id
        count_statement = "SELECT COUNT(*) as total_count FROM transactions"
        result = db.session.execute(count_statement)
        count = next(result).total_count

        transaction_id = count + 1

        # 存入数据库
        insert_statement = ("INSERT INTO transactions " +
                            "VALUES(" + str(transaction_id) + ", '" + str(date) + "', '" +
                            str(salesperson_id) + "', '" + str(customer_id) + "')")

        db.session.execute(insert_statement)
        db.session.commit()

        transaction_id = str(transaction_id)
        notice = "transaction created successfully"
        db.session.remove()
        return jsonify({'notice':notice, 'transaction_id':transaction_id}), 200


@app.route('/sub_transaction/<transaction_id>', methods=['POST','GET'])
def sub_transaction(transaction_id):
    if request.method == "POST":
        # 获取表格
        # 获取数据
        product_id = request.args.get("product_id")
        if product_id == 0:
            db.session.remove()
            return "Please choose the product", 512

        quantity = request.args.get("quantity")

        # 生成子订单id
        count_statement = "SELECT COUNT(*) as total_count FROM sub_transactions"
        result = db.session.execute(count_statement)
        count = next(result).total_count
        sub_transaction_id = count + 1

        # 存入数据
        length = len(product_id)
        i = 0
        j = 0
        while True:
            if product_id[i] == "]":
                break

            # 递归
            temp_product = ""
            temp_quantity = ""
            i = i + 1
            j = j + 1
            while product_id[i] != "," and product_id[i] != "]":
                temp_product += product_id[i]
                i = i + 1

            while quantity[j] != "," and quantity[j] != "]":
                temp_quantity += quantity[j]
                j = j + 1

            # 转化为int类型

            temp_product = int(temp_product)
            temp_quantity = int(temp_quantity)

            if temp_quantity == 0:
                db.session.remove()
                return "Please input the quantity", 512

            # 查找
            query_statement = "SELECT * FROM products WHERE product_id = " + str(temp_product)
            product_existed = db.session.execute(query_statement)

            if product_existed.rowcount == 0:
                db.session.remove()
                return "product doesn't existed", 513

            # 查找2
            amount = next(product_existed).inventory_amount
            if amount < temp_quantity:
                db.session.remove()
                return "There is no enough product", 514

            # 导入
            insert_statement = ("INSERT INTO sub_transactions " +
                                "VALUES(" + str(sub_transaction_id) + ", " + str(temp_product) + ", " +
                                str(transaction_id) + ", " + str(temp_quantity) + ")")

            db.session.execute(insert_statement)
            db.session.commit()
            # 还要再修改原本的product的存量
            sub_transaction_id = sub_transaction_id + 1

        db.session.remove()
        return "sub_transaction created correctly", 200


@app.route('/product', methods=['POST','GET'])
def product():
    if request.method == "POST":
        # 获取表格
        # 获取数据
        name = request.args.get("name")
        if len(name) == 0:
            flash("Please input the name")
            db.session.remove()
            return "Please input the name", 512
        category = request.args.get("category")
        if len(category) == 0:
            flash("Please input the category")
            db.session.remove()
            return "Please input the category", 512
        price = request.args.get("price")
        if price == 0:
            flash("Please input the price")
            db.session.remove()
            return "Please input the price", 512
        inventory_amount = request.args.get("inventory_amount")
        # inventory_amount可以为0

        # 获取目前在列表中已经存在的product数量
        query_statement = "SELECT COUNT(*) as total_count FROM products"
        result = db.session.execute(query_statement)
        count = next(result).total_count
        product_id = count + 1

        # 存入数据
        insert_statement = ("INSERT INTO products " +
                            "VALUES(" + str(product_id) + ", '" + str(name) + "', '" +
                            str(category) + "', " + str(price) + ", " + str(inventory_amount) + ")")
        db.session.execute(insert_statement)
        db.session.commit()
        flash("product create successfully")
        db.session.remove()
        return "product create successfully", 200


# delete function：
# -----------------------------------------------
# -----------------------------------------------
@app.route('/delete/product', methods=['GET','POST'])
def delete_product():
    if request.method == "POST":
        # 获取表格
        Product = initDatabase.Products
        # 获取前端返回的id
        product_id = request.args.get("product_id")

        # 查看该product是否存在
        product_existed = Product.query.get(product_id)
        if not product_existed:
            db.session.remove()
            return "The product doesn't exist", 512

        # 如果存在，删除
        try:
            delete_statement = "DELETE FROM products WHERE product_id = " + str(product_id)
            db.session.execute(delete_statement)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            db.session.remove()
            return f"false: {str(e)}", 513

        db.session.remove()
        return "The product is deleted correctly", 200


@app.route('/delete/sub_transaction',methods=['GET','POST'])
def delete_sub_transaction():
    if request.method == "POST":
        # 获取表
        Sub_Transaction = initDatabase.Sub_Transactions

        # 向前端获取sub_transaction_id
        sub_transaction_id = request.args.get("sub_transaction_id")

        # 判断该订单是否存在
        sub_transaction_existed = Sub_Transaction.query.get(sub_transaction_id)
        if not sub_transaction_existed:
            db.session.remove()
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
        db.session.remove()
        return "delete correctly", 200


# query function：
# -----------------------------------------------
# -----------------------------------------------
@app.route('/query/salesperson', methods=['GET'])
def query_salesperson():
    if request.method == "GET":
        # 查询
        query_statement = "SELECT * FROM salespersons"
        all_salesperson = db.session.execute(query_statement)

        salesperson_dicts = []
        for temp in all_salesperson:
            salesperson_dict = {'salesperson_id':temp.salesperson_id, 'name':temp.name,
                                'email':temp.email, 'job_title':temp.job_title,
                                'store_assigned':temp.store_assigned, 'salary':temp.salary,
                                'state':temp.state, 'city':temp.city,
                                'address':temp.address, 'zip_code':temp.zip_code}
            salesperson_dicts.append(salesperson_dict)

        return json.dumps(salesperson_dicts), 200


@app.route('/query/salespersonID', methods=['POST'])
def query_salesperson_id():
    if request.method == "POST":
        # 从前端获取id
        salesperson_id = request.args.get("salesperson_id")
        # 查询
        query_statement = ("SELECT * FROM salespersons " +
                           "WHERE salesperson_id = '" + str(salesperson_id) + "'")
        result = db.session.execute(query_statement)
        # 检查是否存在
        if result.rowcount == 0:
            return "salesperson doesn't existed", 512
        salesperson_get = next(result)
        salesperson_dict = {'salesperson_id':salesperson_get.salesperson_id, 'name':salesperson_get.name,
                            'email':salesperson_get.email, 'job_title':salesperson_get.job_title,
                            'store_assigned':salesperson_get.store_assigned, 'salary':salesperson_get.salary,
                            'state':salesperson_get.state, 'city':salesperson_get.city,
                            'address':salesperson_get.address, 'zip_code':salesperson_get.zip_code}
        return json.dumps(salesperson_dict), 200


@app.route('/query/storeID', methods=['POST'])
def query_store_id():
    if request.method == "POST":
        # 从前端获取id
        store_id = request.args.get("store_id")
        # 查询
        query_statement = ("SELECT * FROM store " +
                           "WHERE store_id = " + str(store_id))
        result = db.session.execute(query_statement)
        # 判断是否存在
        if result.rowcount == 0:
            return "store doesn't existed", 512
        store_get = next(result)
        store_dict = {'store_id':store_get.store_id, 'address':store_get.address,
                      'state':store_get.state, 'city':store_get.city, 'manager':store_get.manager,
                      'number_of_salesperson':store_get.number_of_salesperson, 'region':store_get.region}
        return json.dumps(store_dict), 200


@app.route('/query/regionID', methods=['POST'])
def query_region_id():
    # 从前端获取region_id
    region_id = request.args.get("region_id")

    # 查看是否存在
    query_statement = ("SELECT * FROM region " +
                       "WHERE region_id = " + str(region_id))
    result = db.session.execute(query_statement)
    if result.rowcount == 0:
        return "region doesn't existed", 512
    region_get = next(result)
    region_dict = {'region_id':region_get.region_id, 'region_name':region_get.region_name,
                   'region_manager':region_get.region_manager}
    return json.dumps(region_dict), 200


@app.route('/query/customerID', methods=['POST'])
def query_customer_id():
    if request.method == "POST":
        # 从前端获取customer_id
        customer_id = request.args.get("customer_id")

        # 查看用户是否存在
        query_statement = "SELECT * FROM customers WHERE customer_id = '" + str(customer_id) + "'"
        customer_existed = db.session.execute(query_statement)
        if customer_existed.rowcount == 0:
            return "customer doesn't existed", 512

        temp_customer = next(customer_existed)
        # 判断用户类型
        type_customer = temp_customer.kind
        if type_customer == "business":
            # 查找表
            query_statement_2 = "SELECT * FROM business_customers WHERE customer_id = '" + str(customer_id) + "'"
            result = db.session.execute(query_statement_2)
            temp_business = next(result)
            all_customer_information = {'customer_id': customer_id, 'address': temp_customer.address,
                                        'state': temp_customer.state, 'city': temp_customer.city,
                                        'zip_code': temp_customer.zip_code, 'kind': temp_customer.kind,
                                        'company_name': temp_business.company_name,
                                        'business_category': temp_business.business_category,
                                        'company_income': temp_business.company_income}
            return json.dumps(all_customer_information), 200
        elif type_customer == "home":
            # 查找表
            query_statement_2 = "SELECT * FROM home_customers WHERE customer_id = '" + str(customer_id) + "'"
            result = db.session.execute(query_statement_2)
            temp_home = next(result)
            all_customer_information = {'customer_id': customer_id, 'address': temp_customer.address,
                                        'state': temp_customer.state, 'city': temp_customer.city,
                                        'zip_code': temp_customer.zip_code, 'kind': temp_customer.kind,
                                        'marriage_status': temp_home.marriage_status,
                                        'gender': temp_home.gender, 'age': temp_home.age}
            return json.dumps(all_customer_information), 200
        else:
            return "type is incorrect", 513


@app.route('/query/transaction/customerID', methods=['POST'])
def query_transaction_customerID():
    if request.method == "POST":
        # 获取表格
        Customer = initDatabase.Customers

        # 获取用户ID
        customer_id = request.args.get("customer_id")

        customer_get = Customer.query.get(customer_id)
        if not customer_get:
            db.session.remove()
            return "customer doesn't existed", 512

        # 根据customerID 查找订单
        query_statement = ("SELECT * FROM sub_transactions "
                           "JOIN transactions ON sub_transactions.transaction_id = transactions.transaction_id "
                           "WHERE transactions.customer_id = '" + str(customer_id) + "' " +
                           "ORDER BY sub_transactions.transaction_id DESC")
        try:
            all_transactions = db.engine.execute(query_statement)
        except Exception as e:
            db.session.remove()
            return f"false: {str(e)}", 513

        final_result = []
        for current_transaction in all_transactions:
            main_transaction_id = current_transaction.transaction_id
            has_tr = False
            for tr in final_result:
                if tr['transaction_id'] == main_transaction_id:
                    has_tr = True
                    break

            if not has_tr:
                temp_dicts = {'transaction_id': main_transaction_id,
                              'salesperson_id': current_transaction.salesperson_id,
                              'customer_id': current_transaction.customer_id,
                              'date': current_transaction.date,
                              'sub_transactions': []}
                final_result.append(temp_dicts)

            sub_transaction_dict = {
                'product_id': current_transaction.product_id,
                'quantity': current_transaction.quantity}

            for tr in final_result:
                if tr['transaction_id'] == main_transaction_id:
                    tr['sub_transactions'].append(sub_transaction_dict)

        db.session.remove()
        return jsonify(final_result), 200


@app.route('/query/product', methods=['GET'])
def query_product():
    if request.method == "GET":
        # 获取表格
        Product = initDatabase.Products

        all_product = Product.query.all()

        product_dicts = []

        for temp in all_product:
            product_dict = {'product_id': temp.product_id, 'name': temp.name,
                            'category': temp.category, 'price': temp.price,
                            'inventory_amount': temp.inventory_amount, 'avatar':temp.avatar}
            product_dicts.append(product_dict)

        db.session.remove()
        return json.dumps(product_dicts), 200


@app.route('/query/sub_transaction', methods=['GET'])
def query_sub_transaction():
    if request.method == "GET":
        # 要和transactions联合
        try:
            query_statement = "SELECT * FROM sub_transactions JOIN transactions ON sub_transactions.transaction_id = transactions.transaction_id"
            all_transactions = db.engine.execute(query_statement)
        except Exception as e:
            db.session.remove()
            return f"false: {str(e)}", 512

        transaction_dicts = []
        for temp in all_transactions:
            transaction_dict = {'transaction_id':temp.transaction_id, 'date':temp.date,
                                'salesperson_id':temp.salesperson_id,
                                'customer_id':temp.customer_id,
                                'sub_transaction_id':temp.sub_transaction_id,
                                'product_id':temp.product_id,
                                'quantity':temp.quantity}
            transaction_dicts.append(transaction_dict)

        db.session.remove()
        return json.dumps(transaction_dicts), 200


@app.route('/query/productID', methods=['POST'])
def query_productID():
    if request.method == "POST":
        # 获取表格
        product_id = request.args.get("product_id")

        # 根据id查找
        query_statement = "SELECT * FROM products WHERE product_id = " + str(product_id)
        product_result = db.session.execute(query_statement)
        if product_result.rowcount == 0:
            db.session.remove()
            return "Product doesn't existed", 512

        # 将查询结果封装成字典
        temp = next(product_result)
        product_dict = {'product_id': temp.product_id, 'name': temp.name,
                        'category': temp.category, 'price': temp.price,
                        'inventory_amount': temp.inventory_amount, 'avatar': temp.avatar}

        db.session.remove()
        return json.dumps(product_dict), 200


# 判断当前用户是customer还是salesperson
@app.route('/users/judge', methods=['POST'])
def users_judge():
    if request.method == "POST":
        user_id = request.args.get("user_id")
        # 根据user_id查找
        query_statement = "SELECT * FROM user WHERE user_id = '" + str(user_id) + "'"
        user = db.engine.execute(query_statement)

        # 如果用户不存在，报错
        if not user:
            db.session.remove()
            return "user doesn't existed!", 512

        # 如果存在，则在customer中查找
        query_statement_2 = "SELECT * FROM customers WHERE customer_id = '" + str(user_id) + "'"
        user_type = db.engine.execute(query_statement_2)
        # 如果不存在，则用户是管理员
        if not user_type:
            db.session.remove()
            return "user is salesperson!", 200
        else:
            db.session.remove()
            return "user is customer!", 200


@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()


if __name__ == '__main__':
    app.run()
