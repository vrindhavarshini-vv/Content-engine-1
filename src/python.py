# from flask import Flask, jsonify, request
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager, create_access_token , jwt_required

# app = Flask(__name__)
# CORS(app)
# JWTManager(app)

# SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
#     username="virundhavarshini",
#     password="2526mkvv",
#     hostname="virundhavarshini.mysql.pythonanywhere-services.com",
#     databasename="virundhavarshini$contentEngine",
# )
# app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
# app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.secret_key = "authenticationKey"
# db = SQLAlchemy(app)


# class Register(db.Model):
#     __tablename__ = "registeredUser"
#     userId = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     userName = db.Column(db.String)
#     userEmail = db.Column(db.String)
#     userPassword = db.Column(db.String)
#     userStatus = db.Column(db.String)
# @app.route("/postRegisteredUser",methods=["GET","POST"])
# def registeredUser():
#     if request.method== "POST":
#         userDatas = Register(userName = request.form["userName"],
#                             userEmail = request.form["userEmail"],
#                         userPassword = request.form["userPassword"],
#                         userStatus = request.form["userStatus"])
#         db.session.add(userDatas)
#         db.session.commit()
#         return "success"
# @app.route("/getRegisteredUser" , methods=["GET"])
# def getRegisterUser():
#     getRegisterUser = Register.query.all()

#     return jsonify([
#             {"userName":user.userName,"userEmail":user.userEmail,"userPassword":user.userPassword, "userId":user.userId ,"userStatus": user.userStatus}
#             for user in getRegisterUser
#     ])
# @app.route('/editUserStatus/<int:approvedId>',methods=['PUT'])
# def editUserStatus(approvedId):
#     editedRegister = Register.query.filter_by(userId = approvedId).first()
#     data = request.form
#     editedRegister.userStatus = data['userStatus']
#     db.session.commit()
#     return jsonify({"User status updated"})
# @app.route('/login',methods=['POST'])
# def loginUser():
#     data = request.form
#     loginData = Register.query.filter_by(userEmail=data['userEmail'],userPassword=data['userPassword']).first()
#     tokendata = create_access_token(identity = data['userEmail'])

#     if loginData is None:
#         return "user is not found"


#     return jsonify({"userName":loginData.userName,"userEmail":loginData.userEmail,"userPassword":loginData.userPassword, "userId":loginData.userId ,"userStatus": loginData.userStatus,'token':tokendata})




# class Category(db.Model):
#     __tablename__ = "categories"
#     categoryId = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     categoryName = db.Column(db.String)
#     types = db.relationship('Type', backref='category', lazy=True)
#     generated_data = db.relationship('Generate', backref='category', lazy=True)
# @app.route("/dataBaseCategory", methods=["GET"])
# @jwt_required()
# def getCategories():
#     categories = Category.query.all()
#     return jsonify([
#         {"categoryId": category.categoryId, "categoryName": category.categoryName} for category in categories
#     ])
# @app.route("/postCategory",methods=["GET","POST"])
# @jwt_required()
# def category():
#     if request.method== "POST":
#         categorydata=Category(categoryName=request.form["categoryName"])
#         db.session.add(categorydata)
#         db.session.commit()
#     return "success"



# class Type(db.Model):
#     __tablename__ = "types"
#     typeId = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     typeName = db.Column(db.String)
#     categoryId = db.Column(db.Integer, db.ForeignKey('categories.categoryId'), nullable=False)
#     generated_data = db.relationship('Generate', backref='type', lazy=True)
# @app.route("/dataBaseType", methods=["GET"])
# @jwt_required()
# def getTypes():
#     types = Type.query.all()
#     return jsonify([
#         {"typeId": type.typeId, "typeName": type.typeName, "categoryId": type.categoryId} for type in types
#     ])
# @app.route("/postType",methods=["GET","POST"])
# @jwt_required()
# def addtype():
#     if request.method== "POST":
#         typedata=Type(typeName=request.form["typeName"],
#                                  categoryId=request.form["categoryId"]  )
#         db.session.add(typedata)
#         db.session.commit()
#     return "success"
# @app.route("/settingGetType/<int:id>", methods=["GET"])
# @jwt_required()
# def getType(id):
#     types_list=Type.query.filter_by(categoryId=id).all()
#     return jsonify([
#         {"typeId":type_list.typeId,"typeName":type_list.typeName,"categoryId":type_list.categoryId} for type_list in types_list
#     ])

# @app.route("/deleteList/<int:typeId>",methods=["DELETE"])
# def deleteList(typeId):
#     deleteData=Type.query.filter_by(typeId=typeId).first()
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



