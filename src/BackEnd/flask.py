
# A very simple Flask Hello World app for you to get started with...

from flask import Flask,jsonify,request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager,create_access_token,jwt_required


app = Flask(__name__)

CORS(app)


SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="AnishKrishnan",
    password="agaram12345",
    hostname="AnishKrishnan.mysql.pythonanywhere-services.com",
    databasename="AnishKrishnan$MySQLDataBase",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
JWTManager(app)
db = SQLAlchemy(app)
app.secret_key='hey'


class Todo(db.Model):
    __tablename__ = 'employee'
    emp_id = db.Column(db.Integer,primary_key = True,autoincrement = True)
    emp_name = db.Column(db.String)
    emp_dept = db.Column(db.String)



# -----FOR CATETORY------
class SetCategory(db.Model):
    __tablename__ = 'category'
    categoryId = db.Column(db.Integer,primary_key = True,autoincrement = True)
    categoryName = db.Column(db.String)

# POST CATEGORY
@app.route("/categoryList",methods=["GET","POST"])
@jwt_required()
def category():
    if request.method== "POST":
        categorydata=SetCategory(categoryName=request.form["categoryName"])
        db.session.add(categorydata)
        db.session.commit()
    return "success"

# GET CATEGORY
@app.route('/getCategory',methods = ["GET"])
@jwt_required()
def getCategory():
    getCategories = SetCategory.query.all()
    return jsonify([
                        {'categoryId':category.categoryId,'categoryName':category.categoryName} for category in getCategories
                    ])


# -----FOR TYPE-----
class SetType(db.Model):
    __tablename__ = 'type'
    typeId = db.Column(db.Integer,primary_key = True,autoincrement = True)
    typeName = db.Column(db.String)
    categoryId = db.Column(db.Integer,db.ForeignKey('category.categoryId'))

# GET PARTICULAR TYPE
@app.route("/settingGetType/<int:id>", methods=["GET"])
@jwt_required()
def getTypes(id):
    type_list=SetType.query.filter_by(categoryId=id).all()
    return jsonify([
        {"typeId":lists.typeId,"typeName":lists.typeName,"categoryId":lists.categoryId}for lists in type_list
        ])
# POST TYPE
@app.route("/typeList",methods=["GET","POST"])
@jwt_required()
def addtype():
    if request.method== "POST":
        typedata=SetType(typeName=request.form["typeName"],
                                 categoryId=request.form["categoryId"]  )
        db.session.add(typedata)
        db.session.commit()
    return "success"

# GET TYPE
@app.route('/getType', methods = ['GET'])
@jwt_required()
def getType():
    getTypes = SetType.query.all()
    return jsonify([
                        {'typeId':typ.typeId,'typeName':typ.typeName,'categoryId':typ.categoryId} for typ in getTypes
                    ])
# DELETE TYPE
@app.route("/deleteList/<int:typeId>",methods=["DELETE"])
@jwt_required()
def deleteList(typeId):
    deleteData=SetType.query.filter_by(typeId=typeId).first()
    db.session.delete(deleteData)
    db.session.commit()
    return jsonify({"message":"Todo Delete successfully"})


#----FOR TEMPLATE----
class SetTemplate(db.Model):
    __tablename__ = 'generatedDatas'
    generatedDataId = db.Column(db.Integer,primary_key = True, autoincrement = True)
    categoryId = db.Column(db.Integer,db.ForeignKey('category.categoryId'))
    typeId = db.Column(db.Integer,db.ForeignKey('type.typeId'))
    datas = db.Column(db.String)
    templates = db.Column(db.String)

# POST GENERATED DATAS
@app.route("/dataBasePostGeneratedDatas", methods=["GET","POST"])
@jwt_required()
def postGeneratedData():
     if request.method== "POST":
        generatedDatas = SetTemplate(
                                 categoryId = request.form["categoryId"],
                                 typeId = request.form["typeId"],
                                 datas = request.form["datas"],
                                 templates = request.form["templates"])
        db.session.add(generatedDatas)
        db.session.commit()
        return "success"

# GET TEMPLATE
@app.route('/getTemplate', methods = ['GET'])
@jwt_required()
def getTemplate():
    getTemplates = SetTemplate.query.all()
    return jsonify([
                        {'categoryId':temp.categoryId,'typeId':temp.typeId,'generatedDataId':temp.generatedDataId,'datas':temp.datas,'template':temp.templates}
                        for temp in getTemplates
                    ])

@app.route('/getSelectedTemplate/<int:getId>',methods=['GET'])
@jwt_required()
def getSelectedTemplate(getId):
    getTemplate = SetTemplate.query.filter_by(generatedDataId=getId).first()

    if getTemplate is None:
        return jsonify({"error": "Data not found"}), 404

    return jsonify({
        'generatedDataId': getTemplate.generatedDataId,
        'datas': getTemplate.datas,
        'templates': getTemplate.templates
    })


class SuuperAdmin(db.Model):
    __tablename__ = 'superAdmin'
    registerID = db.Column(db.Integer,primary_key = True, autoincrement = True)
    userName = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
    status = db.Column(db.String)


@app.route('/log',methods=['POST'])
def loginUser():
    # return create_access_token(identity = 'abc')
    data = request.form
    loginData = SuuperAdmin.query.filter_by(email=data['emaildata'],password=data['passworddata']).first()
    tokendata = create_access_token(identity = data['emaildata'])

    if loginData is None:
        return "user is not found"


    return jsonify({'email':loginData.email,'userName':loginData.password,'token':tokendata})

@app.route('/createUser',methods=['POST'])
def createUser():
    datas =  request.form
    registerData = SuuperAdmin(userName = datas['userName'],email = datas['email'],password = datas['password'],status = datas['status'])
    db.session.add(registerData)
    db.session.commit()
    return 'register successfully'

@app.route('/getRegisterData',methods=['GET'])
def getRegisterData():
    registerDatas = SuuperAdmin.query.all()
    return jsonify(
        [
            {
                'RegisterId' : data.registerID,
                'Name':data.userName,
                'email':data.email,
                'password':data.password,
                'status':data.status
            }for data in registerDatas
        ])



















# @app.route('/newCategory',methods=['POST','GET'])
# def newCat():
#     if request.method=='POST':
#         newCatData = request.form
#         newCategory = SetCategory(categoryName = newCatData['categoryName'])
#         db.session.add(newCategory)
#         db.session.commit()
#         return 'successfully add'


# @app.route('/getData',methods=['GET'])
# def getData():
#     getDatas = Todo.query.all()
#     return jsonify(
#                         [
#                             {'id':todo.emp_id,'name':todo.emp_name,'department':todo.emp_dept} for todo in getDatas
#                         ]
#                     )



# @app.route('/createNew',methods=['POST','GET'])
# def newDate():
#     if request.method == "POST":
#         data = request.form
#         newuser = Todo(emp_name=data['name'],emp_dept=data['department'])
#         db.session.add(newuser)
#         db.session.commit()
#     return 'success'

# @app.route('/deleteUser/<int:deleteID>',methods=['DELETE'])
# def deleteData(deleteID):
#     # if request.method == 'DELETE':
#     deleteUser = Todo.query.filter_by(emp_id = deleteID).first()
#     db.session.delete(deleteUser)
#     db.session.commit()
#     return jsonify({'message':'user deleted successfully'})

# @app.route('/getParticularData/<int:getId>', methods=['GET'])
# def getpartiData(getId):
#     getData = Todo.query.filter_by(emp_id=getId).first()

#     if getData is None:
#         return jsonify({"error": "Data not found"}), 404

#     return jsonify({
#         'id': getData.emp_id,
#         'name': getData.emp_name,
#         'department': getData.emp_dept
#     })

# @app.route('/update/<int:Id>',methods=['PUT'])
# def update(Id):
#     updateUser = Todo.query.filter_by(emp_id = Id).first()
#     data = request.form
#     updateUser.emp_name = data['name']
#     updateUser.emp_dept = data['department']
#     db.session.commit()
#     return 'success'









# @app.route('/home')
# def hello_world():
#     # return 'Hello Anish Krishnan!'
#     # return __name__
#     fav_clr = ['blue','green']
#     listDic = [
#                 {
#                     'name':'Anish krishnan',
#                     'age':21,
#                     'native':'Ammandivilai'
#                 },{
#                     'name':'Suthan SK',
#                     'age':24,
#                     'native':'Nagercoil'
#                 },{
#                     'name':'Bala Ramesh',
#                     'age':21,
#                     'native':'KumaraPuram'
#                 }
#             ]

#     return render_template('index.html',name='ANISH KRISHNAN',clr=fav_clr,listDic=listDic)

# @app.route('/hello')
# def hello():
#     return render_template('hello.html',name='ABI KRISH')




