const express = require('express')
const app = express();
const cors = require('cors');
//cors permite que o ajax seja acessado por outros dominios
app.use(cors());

//add o modulo pg para acessar o postgress
const pg = require('pg');


//receber paramentros no formato json
app.use(express.json());


//instancia
const client = new pg.Client({
    user: '',
    host: 'localhost',
    database: '',
    password: '',
    port: 
});

//conectando com cliente postgress
client.connect();


//pegar parametros
app.get('/', function (req, res) {
    client.query('SELECT * FROM cliente')
        .then(
            function (ret) {
                let array = [];

                for (cliente of ret.rows) {
                    array.push(
                        {
                            id: cliente.cod_cliente,
                            nome: cliente.nome,
                            cpf: cliente.cpf,
                            email: cliente.email


                        }
                    )

                }
                res.json(
                    {
                        status: 'Ok',
                        numeroDeResultados: array.length,
                        resultados: array
                    }
                )
            }
        )
});

//pegar valores por parametros
app.get('/cliente/:cod_cliente', function (req, res) {
    client.query(
        {
            text: 'SELECT * FROM cliente WHERE cod_cliente = $1',
            values: [req.params.cod_cliente]

        }
    )
        .then(
            function (ret) {
                let cliente = ret.rows[0];
                res.json({
                    status: 'Ok',
                    nome: cliente.nome,
                    email: cliente.email,
                    cpf: cliente.cpf

                });
            }
        )
});

//inserir dados
app.post('cliente/', function (req, res) {
    client.query(
        {
            text: 'INSERT INTO cliente(nome , email, cpf) VALUES ($1, $2, $3)',
            values: [req.body.nome, req.body.email, req.body.cpf]
        }
    )
        .then(
            function (ret) {
                res.json(
                    {
                        status: 'Ok',
                        dadosEnviados: req.body
                    }
                )
            }
        )
})

//Apagar dados 
app.delete('/:cod_cliente', function (req, res) {
    client.query(
        {
            text: 'DELETE FROM cliente WHERE cod_cliente=$1',
            values: [req.params.cod_cliente]
        }
    ).then(function(ret){
        res.json(
            {
                status: 'dados deletado',
                dadosDeletados: req.body
            }
        )
    })
});

app.listen(
    3014,
    function () {
        console.log('Servididor web funcionando');
    }
);