const express = require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');  // body-parser를 가져옵니다. (선택 사항)
const app = express()
const bcrypt = require('bcrypt');
const db = require('./lib/db.js');
const sessionOption = require('./lib/sessionOption.js');
const port = 7070

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);
const cors = require('cors');


// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }));

app.use(session({  
	key: 'session_cookie_name',
    secret: '~',
    resave: true,
	saveUninitialized: true,
}))

app.use(cookieParser('session_cookie_name'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true'); // 이 옵션을 추가해 주세요
    next();
});


app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

function encrypt(data, secretKey) {
    const iv = require('crypto').randomBytes(16);
    const cipher = require('crypto').createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;

}

function calculateHash(data) {
    const hash = require('crypto').createHash('sha256'); // 64글자
    hash.update(JSON.stringify(data));
    return hash.digest('hex');
}

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(port);
})

app.post('/api/signIn', (req, res) => {
    const id = req.body.id;
    const pw = req.body.pw;
    const auth = req.body.auth;
    const name = req.body.name;
    const authKey = req.body.authKey;
    const sendData = {isSign: ""};

    db.query('SELECT * FROM user WHERE id = ?', [id], function(error, results, fields) { 
        if (error) throw error;
        if (results.length == 0) {
            const hasedPassword = bcrypt.hashSync(pw, 10);    // 입력된 비밀번호를 해시한 값        
            db.query('INSERT INTO user VALUES(?,?,?,?)', [id, hasedPassword ,auth, name], function (error, data) {
            if (error) throw error;
            req.session.save(function () {                        
                sendData.isSign = "True"
                res.send(sendData);
            });
            });
        }
        else if(results.length > 0){                                              
            sendData.isSign = "이미 존재하는 아이디 입니다!"
            res.send(sendData);  
        }else {
            sendData.isSign = "형식이 잘못되었습니다.";
            res.send(sendData);
        }
    });
})

app.post('/api/login', (req, res) => {
    const id = req.body.id;
    const pw = req.body.pw;
    const sendData = { isLogin: "" };
    var roles;

    db.query('SELECT * FROM user WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {     
            bcrypt.compare(pw , results[0].pw, (err, result) => {    // 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교
                if (result === true) { 
                    if(results[0].auth == "teacher"){
                        roles = "teacher";
                    }else{
                        roles = "student";
                    }
                    req.session.user = {
                        id: results[0].id,
                        name: results[0].name,
                        roles: roles
                      };
                    console.log(req.session.user);
                    sendData.isLogin = "True"
                    res.send(sendData);
                } else {
                    sendData.isLogin = "False";
                    res.send(sendData);
                }
            });
        }
        else{                               
            sendData.isLogin = "False"
            res.send(sendData);
        }
    })                      
});


app.post('/api/loadMain', (req, res) => {
    try {
        console.log(req.session)
        let session = req.session;
        // if (session && session.user) {
            db.query('SELECT title, board_id FROM board', (error, results, fields) => {
                if (error) {
                    throw error;
                }
                // console.log(results)
                return res.json({ status: true, result: results});
            });
        // } else {
        //     return res.json({ status: false });
        // }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


app.get('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    db.query('SELECT board_id, title, writer, contents, writer_date FROM board WHERE board_id = ?', [postId], (error, results) => {
      if (error) throw error
      if (results.length === 0) {
        return res.status(404).send({ error: 'Post not found' });
      }
    //   console.log(results[0]);
      res.json(results[0]);
    });
  });
  

  app.post('/api/write', (req, res) => {
    const title = req.body.title;
    const contents = req.body.contents;
    const write_date = new Date(); // 현재 날짜 생성

    db.query('SELECT MAX(board_id) + 1 AS maxId FROM board', (error, result) => {
        if (error) {
            console.error(error);
            return res.json({ status: false, error: 'Failed to get max board_id' });
        }

        const maxId = result[0].maxId || 1; // maxId가 null이면 기본값으로 1 설정

        db.query('INSERT INTO board (board_id, title, writer, contents, writer_date) VALUES (?, ?, ?, ?, ?)', 
            [maxId, title, "temp", contents, write_date], 
            (error, results) => {
                if (error) {
                    console.error(error);
                    return res.json({ status: false, error: 'Failed to write post' });
                }

                return res.json({ status: true });
            }
        );
    });
});