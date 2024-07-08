const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./lib/db.js');
const sessionOption = require('./lib/sessionOption.js');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const app = express();
const port = 7070;

const sessionStore = new MySQLStore(sessionOption);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(cookieParser('session_cookie_secret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'session_cookie_secret',
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        path: '/',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false, // 로컬 개발 환경에서는 false로 유지
    },
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    console.log(`Session ID: ${req.sessionID}`);
    console.log(`Session data: ${JSON.stringify(req.session)}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/signIn', (req, res) => {
    const { id, pw, auth, name, authKey } = req.body;
    const sendData = { isSign: "" };

    db.query('SELECT * FROM user WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            const authQuery = auth === 'student' ? 'SELECT authKey FROM authKey ORDER BY authKey DESC LIMIT 1' : 'SELECT TauthKey FROM authKey ORDER BY TauthKey DESC LIMIT 1';
            db.query(authQuery, (error, key) => {
                if (authKey === key[0][auth === 'student' ? 'authKey' : 'TauthKey']) {
                    const hashedPassword = bcrypt.hashSync(pw, 10);
                    db.query('INSERT INTO user VALUES (?, ?, ?, ?)', [id, hashedPassword, auth, name], (error) => {
                        if (error) throw error;
                        req.session.user = { id, name, roles: auth };
                        req.session.save(() => {
                            sendData.isSign = "True";
                            res.send(sendData);
                        });
                    });
                } else {
                    sendData.isSign = "인증키가 틀렸습니다.";
                    res.send(sendData);
                }
            });
        } else {
            sendData.isSign = "이미 존재하는 아이디 입니다!";
            res.send(sendData);
        }
    });
});

app.post('/api/login', (req, res) => {
    const { id, pw } = req.body;
    const sendData = { isLogin: "" };

    db.query('SELECT * FROM user WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            sendData.isLogin = "False";
            return res.send(sendData);
        }
        if (results.length > 0) {
            bcrypt.compare(pw, results[0].pw, (err, result) => {
                if (err) {
                    console.error('Bcrypt error:', err);
                    sendData.isLogin = "False";
                    return res.send(sendData);
                }
                if (result) {
                    const roles = results[0].auth === "teacher" ? "teacher" : "student";
                    req.session.user = {
                        id: results[0].id,
                        name: results[0].name,
                        roles: roles,
                    };
                    req.session.save(err => {
                        if (err) {
                            console.error('Session save error:', err);
                            sendData.isLogin = "False";
                            return res.send(sendData);
                        }
                        console.log('Session after save:', req.session);
                        sendData.isLogin = "True";
                        res.send(sendData);
                    });
                } else {
                    sendData.isLogin = "False";
                    res.send(sendData);
                }
            });
        } else {
            sendData.isLogin = "False";
            res.send(sendData);
        }
    });
});

app.post('/api/loadMain', (req, res) => {
    try {
        console.log('Session data on loadMain:', req.session);
        if (req.session && req.session.user) {
            db.query('SELECT title, board_id FROM board', (error, results) => {
                if (error) throw error;
                res.json({ status: true, result: results, roles: req.session.user.roles});
            });
        } else {
            res.json({ status: false, message: 'No session found' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    db.query('SELECT board_id, title, writer, contents, writer_date FROM board WHERE board_id = ?', [postId], (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).send({ error: 'Post not found' });
        }
        res.json(results[0]);
    });
});

app.post('/api/write', (req, res) => {
    const { title, contents } = req.body;
    const write_date = new Date();

    db.query('SELECT MAX(board_id) + 1 AS maxId FROM board', (error, result) => {
        if (error) {
            console.error(error);
            return res.json({ status: false, error: 'Failed to get max board_id' });
        }

        const maxId = result[0].maxId || 1;
        db.query('INSERT INTO board (board_id, title, writer, contents, writer_date) VALUES (?, ?, ?, ?, ?)', 
            [maxId, title, "temp", contents, write_date], 
            (error) => {
                if (error) {
                    console.error(error);
                    return res.json({ status: false, error: 'Failed to write post' });
                }

                return res.json({ status: true });
            }
        );
    });
});

app.post('/api/userLoad', (req, res) => {
    if(req.session.user.roles != 'teacher'){
        res.json({status: false})
    }else{
        db.query('SELECT id, auth, name from user order by auth desc', (error, results) => {
            if(error) {
                return res.json({status:false, error: 'Failed to get userLoad'});
            }
            console.log(results)
            res.json(results);
        });
    }
});

app.post('/api/deleteUser', (req, res) => {
    dId = req.id;

    if(req.session.user.roles != 'teacher') {
        res.json({status: false});
    }else {
        db.query('delete from user where id = ?', [dId], (error, results) => {
            if(error) {
                return res.json({status:false, error: 'Failed to delete user'})
            }
            res.json({status: true});
        });
    }
});

// app.post('/api/getAuth', (req,res) => {
//     db.query('SELECT * from authKey')
// })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
