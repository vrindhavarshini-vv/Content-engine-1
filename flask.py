# from flask import Flask,jsonify,request
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager,create_access_token,jwt_required

# app = Flask(__name__)

# CORS(app)


# SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
#     username="pavithrakrish95",
#     password="agaram12345",
#     hostname="pavithrakrish95.mysql.pythonanywhere-services.com",
#     databasename="pavithrakrish95$contentEngine",
# )
# app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
# app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.secret_key="test"
# db = SQLAlchemy(app)
# JWTManager(app)

# class Employee(db.Model):
#     __tablename__ = "sample"
#     id = db.Column(db.Integer, primary_key=True,autoincrement=True)
#     item = db.Column(db.String)


# @app.route('/employees', methods=["GET"])
# def get_employees():
#     sample = Employee.query.all()
#     return jsonify([
#         {"id": todo.id, "name": todo.item} for todo in sample
#     ])

# @app.route('/addTodoList', methods=["POST","GET"])
# def SetTodoList():
#     if request.method=="POST":
#         setdata=Employee(item=request.form["tasks"])
#         db.session.add(setdata)
#         db.session.commit()

#     return "success"

# @app.route("/deleteTodo/<int:todoId>",methods=["DELETE"])
# def deleteTodo(todoId):
#     deleteTodo=Employee.query.filter_by(id=todoId).first()
#     db.session.delete(deleteTodo)
#     db.session.commit()
#     return jsonify({"message":"Todo Delete successfully"})

# @app.route("/editTodo/<int:todoId>",methods=["PUT"])
# def editTodo(todoId):
#     edit=Employee.query.filter_by(id=todoId).first()
#     data = request.form
#     edit.item=data["tasks"]
#     db.session.commit()
#     return jsonify({"message":"Todo Edit successfully"})

# @app.route("/viewTodo/<int:todoId>", methods=['GET'])
# def viewTodo(todoId):
#     user=Employee.query.filter_by(id=todoId).first()

#     return jsonify({"id":user.id,"item":user.item}),



# # class User(db.Model):
# #     __tablename__ = "register"
# #     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
# #     username = db.Column(db.String(50), nullable=False)
# #     email = db.Column(db.String(100), unique=True, nullable=False)
# #     password = db.Column(db.String(255), nullable=False)

# # @app.route("/register", methods=["POST"])
# # def register():
# #     if request.method == "POST":
# #         new_user = User(
# #             username=request.form["username"],
# #             email=request.form["email"],
# #             password=request.form["password"]
# #         )
# #         db.session.add(new_user)
# #         db.session.commit()
# #         return "Registration successful"

# # @app.route("/loginData", methods=["POST"])
# # def login():
# #     data=request.form
# #     # email=data["loginEmail"],
# #     # password=data["loginPassword"]
# #     loginData = User.query.filter_by(email=data['loginEmail'],password=data['loginPassword']).first()
# #     tokens = create_access_token(identity=data["loginEmail"])
# #     return jsonify({"email":loginData.email,"username":loginData.password,"token": tokens})
# #     # db.session.commit()
# # # #  else:
# # #         return "failed"


# class Register(db.Model):
#     __tablename__ = "register"
#     id = db.Column(db.Integer, primary_key=True,autoincrement=True)
#     username = db.Column(db.String)
#     email=db.Column(db.String)
#     password=db.Column(db.String)
# @app.route("/register",methods=["GET","POST"])
# def register():
#     if request.method== "POST":
#         registerdata=Register(username=request.form["username"],
#                             email=request.form["email"],
#                             password=request.form["password"])

#         db.session.add(registerdata)
#         db.session.commit()

#     return "success"

# class Login(db.Model):
#     __tablename__  = "loginUser"
#     loginId = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     loginEmail = db.Column(db.String)
#     loginPassword = db.Column(db.String)
# @app.route("/postLoginDatas",methods=["GET","POST"])
# def loginUser():
#     # return create_access_token(identity = "adfdf")
#     if request.method == "POST":
#         token = create_access_token(identity = request.form["loginEmail"])
#         loginData = Login(loginEmail = request.form["loginEmail"],loginPassword = request.form["loginPassword"])
#         db.session.add(loginData)
#         db.session.commit()
#         return jsonify({"token" : token})

#     else:
#         return "failed"

# class SettingCategory(db.Model):
#     __tablename__ = "categories"
#     categoryId = db.Column(db.Integer, primary_key=True,autoincrement=True)
#     categoryName = db.Column(db.String)
#     types=db.relationship('SettingType',backref='category',lazy=True)
# @app.route("/settingGetList", methods=["GET"])
# @jwt_required()

# def getCategories():
#     categories = SettingCategory.query.all()
#     return jsonify([
#         {"categoryId":category.categoryId,"categoryName":category.categoryName} for category in categories
#     ])

# @app.route("/categoryList",methods=["GET","POST"])
# @jwt_required()

# def category():
#     if request.method== "POST":
#         categorydata=SettingCategory(categoryName=request.form["categoryName"])
#         db.session.add(categorydata)
#         db.session.commit()
#     return "success"


# class SettingType(db.Model):
#     __tablename__ = "types"
#     typeId = db.Column(db.Integer, primary_key=True,autoincrement=True)
#     typeName = db.Column(db.String)
#     categoryId = db.Column(db.Integer, db.ForeignKey("categories.categoryId"),nullable = False)
# @app.route("/settingGetType/<int:id>", methods=["GET"])
# @jwt_required()

# def getTypes(id):
#     type_list=SettingType.query.filter_by(categoryId=id).first()
#     return jsonify([
#         {"typeId":type_list.typeId,"typeName":type_list.typeName,"categoryId":type_list.categoryId}
#         ])
# @app.route("/settingGetAllType", methods=["GET"])
# @jwt_required()

# def getData():
#     get_types=SettingType.query.all()
#     return jsonify([
#         {"typeId":type_data.typeId,"typeName":type_data.typeName,"categoryId":type_data.categoryId} for type_data in get_types
#         ])


# @app.route("/typeList",methods=["GET","POST"])
# @jwt_required()
# def addtype():
#     if request.method== "POST":
#         typedata=SettingType(typeName=request.form["typeName"],
#                                  categoryId=request.form["categoryId"]  )
#         db.session.add(typedata)
#         db.session.commit()
#     return "success"
# @app.route("/deleteList/<int:typeId>",methods=["DELETE"])
# def deleteList(typeId):
#     deleteData=SettingType.query.filter_by(typeId=typeId).first()
#     db.session.delete(deleteData)
#     db.session.commit()
#     return jsonify({"message":"Todo Delete successfully"})

# class Generate(db.Model):
#     __tablename__ = "generatedDatas"
#     generatedDataId = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     categoryId = db.Column(db.Integer, db.ForeignKey('categories.categoryId'), nullable=False)
#     typeId = db.Column(db.Integer, db.ForeignKey('types.typeId'), nullable=False)
#     datas = db.Column(db.String)
#     templates = db.Column(db.String)
# @app.route("/dataBaseGetGeneratedDatas", methods=["GET"])
# @jwt_required()
# def getGeneratedDatas():
#     generatedDatas = Generate.query.all()
#     return jsonify([
#         {"generatedDataId": data.generatedDataId, "categoryId": data.categoryId, "typeId": data.typeId, "datas": data.datas,
#          "templates": data.templates} for data in generatedDatas
#     ])
# # @app.route("/dataBaseGetGeneratedDatas", methods=["GET"])
# # @jwt_required()
# # def getGeneratedDatas():
# #     generatedDatas = Generate.query.all()
# #     return jsonify([
# #         {"generatedDataId": data.generatedDataId, "categoryId": data.categoryId, "typeId": data.typeId, "datas": data.datas,
# #          "templates": data.templates} for data in generatedDatas
# #     ])

# @app.route("/dataBasePostGeneratedDatas", methods=["GET","POST"])
# @jwt_required()
# def postGeneratedData():
#      if request.method== "POST":
#         generatedDatas = Generate(
#                                  categoryId = request.form["categoryId"],
#                                  typeId = request.form["typeId"],
#                                  datas = request.form["datas"],
#                                  templates = request.form["templates"])
#         db.session.add(generatedDatas)
#         db.session.commit()
#         return "success"
# @app.route('/getTemplate', methods = ['GET'])
# @jwt_required()
# def getTemplate():
#     getTemplates = SetTemplate.query.all()
#     return jsonify([
#                         {'categoryId':temp.categoryId,'typeId':temp.typeId,'generatedDataId':temp.generatedDataId,'datas':temp.datas,'template':temp.templates}
#                         for temp in getTemplates
#                     ])
# @app.route('/getSelectedTemplate/<int:getId>',methods=['GET'])
# @jwt_required()
# def getSelectedTemplate(getId):
#     getTemplate = Generate.query.filter_by(generatedDataId=getId).first()

#     if getTemplate is None:
#         return jsonify({"error": "Data not found"}), 404

#     return jsonify({
#         'generatedDataId': getTemplate.generatedDataId,
#         'datas': getTemplate.datas,
#         'templates': getTemplate.templates
#     })
from flask import Flask,jsonify,request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager,create_access_token,jwt_required

app = Flask(__name__)

CORS(app)


SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="pavithrakrish95",
    password="agaram12345",
    hostname="pavithrakrish95.mysql.pythonanywhere-services.com",
    databasename="pavithrakrish95$contentEngine",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key="test"
db = SQLAlchemy(app)
JWTManager(app)

class Employee(db.Model):
    __tablename__ = "sample"
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    item = db.Column(db.String)


@app.route('/employees', methods=["GET"])
def get_employees():
    sample = Employee.query.all()
    return jsonify([
        {"id": todo.id, "name": todo.item} for todo in sample
    ])

@app.route('/addTodoList', methods=["POST","GET"])
def SetTodoList():
    if request.method=="POST":
        setdata=Employee(item=request.form["tasks"])
        db.session.add(setdata)
        db.session.commit()

    return "success"

@app.route("/deleteTodo/<int:todoId>",methods=["DELETE"])
def deleteTodo(todoId):
    deleteTodo=Employee.query.filter_by(id=todoId).first()
    db.session.delete(deleteTodo)
    db.session.commit()
    return jsonify({"message":"Todo Delete successfully"})

@app.route("/editTodo/<int:todoId>",methods=["PUT"])
def editTodo(todoId):
    edit=Employee.query.filter_by(id=todoId).first()
    data = request.form
    edit.item=data["tasks"]
    db.session.commit()
    return jsonify({"message":"Todo Edit successfully"})

@app.route("/viewTodo/<int:todoId>", methods=['GET'])
def viewTodo(todoId):
    user=Employee.query.filter_by(id=todoId).first()

    return jsonify({"id":user.id,"item":user.item}),



class User(db.Model):
    __tablename__ = "register"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(255), nullable=False)

@app.route("/register", methods=["POST"])
def register():
    if request.method == "POST":
        new_user = User(
            username=request.form["username"],
            email=request.form["email"],
            password=request.form["password"],
            status=request.form["status"]
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'username':new_user.username,'email':new_user.email,
        'password':new_user.password,'status':new_user.status})

@app.route("/loginData", methods=["POST"])
def loginUser():
    data=request.form
    # email=data["loginEmail"],
    # password=data["loginPassword"]
    loginData = User.query.filter_by(email=data['loginEmail']).filter_by(password=data['loginPassword']).first()
    tokens = create_access_token(identity=data["loginEmail"])
    return jsonify({"email":loginData.email,"username":loginData.password,"token": tokens})

@app.route('/getRegisterData',methods=['GET'])
def getRegisterData():
    registerDatas = User.query.all()
    return jsonify(
        [
            {
                'id' : data.id,
                'username':data.username,
                'email':data.email,
                'password':data.password,
                'status':data.status
            }for data in registerDatas
        ])

@app.route('/changeStatus/<int:changeId>',methods=['PUT'])
def changeStatus(changeId):
    change = User.query.filter_by(id = changeId).first()
    data = request.form
    change.status = data['status']
    db.session.commit()
    return jsonify({'id':change.id,'username':change.username,'email':change.email,'password':change.password,'status':change.status})
#     db.session.commit()
# #  else:
        # return "failed"


# class Register(db.Model):
#     __tablename__ = "register"
#     id = db.Column(db.Integer, primary_key=True,autoincrement=True)
#     username = db.Column(db.String)
#     email=db.Column(db.String)
#     password=db.Column(db.String)
# @app.route("/register",methods=["GET","POST"])
# def register():
#     if request.method== "POST":
#         registerdata=Register(username=request.form["username"],
#                             email=request.form["email"],
#                             password=request.form["password"])

#         db.session.add(registerdata)
#         db.session.commit()

#     return "success"

# class Login(db.Model):
#     __tablename__  = "loginUser"
#     loginId = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     loginEmail = db.Column(db.String)
#     loginPassword = db.Column(db.String)
# @app.route("/postLoginDatas",methods=["GET","POST"])
# def loginUser():
#     # return create_access_token(identity = "adfdf")
#     if request.method == "POST":
#         token = create_access_token(identity = request.form["loginEmail"])
#         loginData = Login(loginEmail = request.form["loginEmail"],loginPassword = request.form["loginPassword"])
#         db.session.add(loginData)
#         db.session.commit()
#         return jsonify({"token" : token})

#     else:
#         return "failed"

class SettingCategory(db.Model):
    __tablename__ = "categories"
    categoryId = db.Column(db.Integer, primary_key=True,autoincrement=True)
    # id=db.Column(db.Integer)
    categoryName = db.Column(db.String)
    types=db.relationship('SettingType',backref='category',lazy=True)
@app.route("/settingGetList", methods=["GET"])
@jwt_required()

def getCategories():
    categories = SettingCategory.query.all()
    return jsonify([
        {"categoryId":category.categoryId,"categoryName":category.categoryName} for category in categories
    ])

@app.route("/categoryList",methods=["GET","POST"])
@jwt_required()

def category():
    if request.method== "POST":
        categorydata=SettingCategory(categoryName=request.form["categoryName"])
        db.session.add(categorydata)
        db.session.commit()
    return "success"


class SettingType(db.Model):
    __tablename__ = "types"
    typeId = db.Column(db.Integer, primary_key=True,autoincrement=True)
    typeName = db.Column(db.String)
    categoryId = db.Column(db.Integer, db.ForeignKey("categories.categoryId"),nullable = False)
@app.route("/settingGetType/<int:id>", methods=["GET"])
@jwt_required()

def getTypes(id):
    type_list=SettingType.query.filter_by(categoryId=id).first()
    return jsonify([
        {"typeId":type_list.typeId,"typeName":type_list.typeName,"categoryId":type_list.categoryId}
        ])
@app.route("/settingGetAllType", methods=["GET"])
@jwt_required()

def getData():
    get_types=SettingType.query.all()
    return jsonify([
        {"typeId":type_data.typeId,"typeName":type_data.typeName,"categoryId":type_data.categoryId} for type_data in get_types
        ])


@app.route("/typeList",methods=["GET","POST"])
@jwt_required()
def addtype():
    if request.method== "POST":
        typedata=SettingType(typeName=request.form["typeName"],
                                 categoryId=request.form["categoryId"]  )
        db.session.add(typedata)
        db.session.commit()
    return "success"
@app.route("/deleteList/<int:typeId>",methods=["DELETE"])
def deleteList(typeId):
    deleteData=SettingType.query.filter_by(typeId=typeId).first()
    db.session  .delete(deleteData)
    db.session.commit()
    return jsonify({"message":"Todo Delete successfully"})

class Generate(db.Model):
    __tablename__ = "generatedDatas"
    generatedDataId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    categoryId = db.Column(db.Integer, db.ForeignKey('categories.categoryId'), nullable=False)
    typeId = db.Column(db.Integer, db.ForeignKey('types.typeId'), nullable=False)
    datas = db.Column(db.String)
    templates = db.Column(db.String)
@app.route("/dataBaseGetGeneratedDatas", methods=["GET"])
@jwt_required()
def getGeneratedDatas():
    generatedDatas = Generate.query.all()
    return jsonify([
        {"generatedDataId": data.generatedDataId, "categoryId": data.categoryId, "typeId": data.typeId, "datas": data.datas,
         "templates": data.templates} for data in generatedDatas
    ])
# @app.route("/dataBaseGetGeneratedDatas", methods=["GET"])
# @jwt_required()
# def getGeneratedDatas():
#     generatedDatas = Generate.query.all()
#     return jsonify([
#         {"generatedDataId": data.generatedDataId, "categoryId": data.categoryId, "typeId": data.typeId, "datas": data.datas,
#          "templates": data.templates} for data in generatedDatas
#     ])

@app.route("/dataBasePostGeneratedDatas", methods=["GET","POST"])
@jwt_required()
def postGeneratedData():
     if request.method== "POST":
        generatedDatas = Generate(
                                 categoryId = request.form["categoryId"],
                                 typeId = request.form["typeId"],
                                 datas = request.form["datas"],
                                 templates = request.form["templates"])
        db.session.add(generatedDatas)
        db.session.commit()
        return "success"
@app.route('/getTemplate', methods = ['GET'])
@jwt_required()
def getTemplate():
    getTemplates = SetTemplate.query.all()
    return jsonify([
                        {'categoryId':temp.categoryId,'typeId':temp.typeId,'generatedDataId':temp.generatedDataId,'datas':temp.datas,'template':temp.templates}
                        for temp in getTemplates
                    ])
@app.route('/getSelectedTemplate/<int:getId>',methods=['GET'])
# @jwt_required()
def getSelectedTemplate(getId):
    getTemplate = Generate.query.filter_by(generatedDataId=getId).first()

    if getTemplate is None:
        return jsonify({"error": "Data not found"}), 404

    return jsonify({
        'generatedDataId': getTemplate.generatedDataId,
        'datas': getTemplate.datas,
        'templates': getTemplate.templates
    })
