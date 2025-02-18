const express = require('express');
const app = express();
// const routes = require('./routes/client/index.route');
const apiRoutesV1Client = require('./api/v1/routes/client/index.route');
// const routesAdmin = require('./routes/admin/index.route');
const apiRoutesAdmin = require('./api/v1/routes/admin/index.route');
const cors = require("cors")

const systemConfig = require('./config/system');
const methodOverride = require('method-override')
const path = require('path');
const database = require("./config/database");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const moment = require('moment');

require("dotenv").config();

database.connect();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
//app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// app.use(methodOverride('X-HTTP-Method-Override'))

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(methodOverride('_method'))
app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());
app.use(cors({
    origin: 'http://localhost:3000', // React frontend URL
    credentials: true,
}));
app.use(bodyParser.json());

//client routes
// routes(app);
apiRoutesV1Client(app);
//admin routes
apiRoutesAdmin(app);
// routesAdmin(app);
app.get('*', (req, res) => {
    res.render("client/pages/error/404", {
        titlePages: "404 not found"
    });
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
