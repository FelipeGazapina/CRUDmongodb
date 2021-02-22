const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const uri = "mongodb+srv://<usuário>:<senha>@cluster0.rb0km.mongodb.net/<nome do banco>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if(err)return console.log(err)
  db = client.db('db_sala')

  app.listen(3000, ()=>{
    console.log('server rodando na porta 3000')
    })
});


app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req,res)=>{
    res.render('index.ejs')
})
app.get('/show',(req,res)=>{
    db.collection('data').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('show.ejs',{data:result})
    })
})


app.post('/show',(req,res)=>{
    db.collection('data').save(req.body, (err,result)=>{
        if(err) return console.log(err)
        console.log('salvo no banco')
        res.redirect('/show')
    })
})

app.route('/edit/:id').get((req,res)=>{
    let id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err,result)=>{
        if(err) return res.send(err)
        res.render('edit.ejs',{data:result})
    })
}).post((req,res)=>{
    let id = req.params.id
    let nome = req.body.name
    let sobrenome = req.body.surname

    db.collection('data').updateOne({_id:ObjectId(id)},{
        $set:{
            name:nome,
            surname:sobrenome
        }
    }, (err,result)=>{
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('banco atualizado')
    })
})

app.route('/delete/:id').get((req,res)=>{
    let id = req.params.id
    db.collection('data').deleteOne({_id:ObjectId(id)},(err,result)=>{
        if (err) return res.send(500,err)
        console.log('Deletando do Banco de Dados')
        res.redirect('/show')
    })
})