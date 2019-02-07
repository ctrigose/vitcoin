let user_data = [];
let btc;
let par;
let hist, prices;
let dw, dh, str, d;
let chart;
let account, database, acc, userId;
let welcome_msg, btc_b, usd_b;


google.charts.load('current', {
    'packages': ['corechart']
});

function setup() {
    frameRate(10);
    //INIT VAR
    init_vars();
}

function init_vars(){
    account = {
        "name":"",
        "usd_balance":0,
        "btc_balance":0.0
    };
    database = firebase.database();
    acc = database.ref('users');
    //acc.on('value',gotData,errData);
    hist = [];
    prices = ['prices', 9000, 9010, 9005];
    //prices[0] = ['time', 'price'];
    par = createP('');

    welcome_msg = select('#welcome');
    btc_b = select('#btc');
    usd_b = select('#usd');

    str = "";
    dw = windowWidth;
    dh = windowHeight;
    getBtc();
}

function draw() {

    if (frameCount % 100 == 0) {
        getBtc();
    }
    /*
    par.position(dw * 0.35, dh * 0.45);
    par.style('font-family:oswald;font-size:' + dw * 0.1);
    if (btc.ask)
        par.html(btc.ask);*/
}

function getBtc() {

    btc = loadJSON('https://api.gdax.com/products/BTC-USD/ticker');
    hist.push(btc);
    parse2arr();

    if (frameCount % 3 == 0 && hist.length > 1) {
        drawGoogleChart();
        //c3Chart();
    }


}

function parse2arr() {
    let row = [];
    let count = [];
    for (let i = 0; i < hist.length; i++) {
        str = String(hist[i].time);
        row[i] = i;
        prices[i] = /*parseInt(hist[i].price); */[new Date(hist[i].time),parseInt(hist[i].price)];
    }
}

function drawGoogleChart() {
    prices.pop();
    let data = new google.visualization.DataTable();
    data.addColumn('date', 'time');
    data.addColumn('number', 'price');
    data.addRows(prices);
    let options = {
        title: '',
        curveType: 'function',
        hAxis: {
            title: 'Time'
        },
        vAxis: {
            title: 'USD/BTC'
        },
        backgroundColor: '#3da07e'
    };

    let chart = new google.visualization.LineChart(document.getElementById('chart'));

    chart.draw(data, options);
}

function c3Chart() {
    prices.pop();
    prices[0] = ['price'];
    chart = c3.generate({
        bindto: '#chart1',
        data: {
            columns: [prices]
        }
    });
}

function graph() {

    if (hist.length > 1) {
        for (let i = 0; i < hist.length; i++) {
            ellipse(10 * i, map(parseInt(hist[i].price), parseInt(hist[0].price) - 500, parseInt(hist[0].price) + 500, dw, 0), 10, 10);
            //console.log(hist[i].price);
        }
        /*
            new Chartist.Line('.ct-chart', {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                series: [
            [12, 9, 7, 8, 5],
            [2, 1, 3.5, 7, 3],
            [1, 3, 4, 5, 6]
          ]
            }, {
                fullWidth: true,
                chartPadding: {
                    right: 40
                }
            });*/
    }
}

function getUserData(){
    userId = firebase.auth().currentUser.uid;
    acc = firebase.database().ref('users/' + userId);
    acc.on('value',gotData,(err)=>console.log(err));
}
function setUserData(name, btc, usd) {
    userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId).set({
        name: name,
        btc_balance : btc,
        usd_balance: usd
    });
}

function gotData(data){
    console.log(data.val());
    account = data.val();
    welcome_msg.html("Welcome, "+account.name);
    btc_b.html("BTC: "+Math.round(account.btc_balance* 1000) / 1000);
    usd_b.html("USD: "+Math.round(account.usd_balance* 1000) / 1000);

    /*let usr = data.val();
    let keys = Object.keys(data.val());
    for(key of keys) user_data.push([usr[key].name, usr[key].usd_balance, usr[key].btc_balance]);*/
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userExists();
        getUserData();
    } else {
        console.log("no user logged in");
    }
});

function userExists(){
    userId = firebase.auth().currentUser.uid;
    let usrs = firebase.database().ref('users');
    usrs.on('value',(data)=>{
        let keys = Object.keys(data.val());
        for(key of keys){
            if(key===userId) {
                console.log('User Verified');
                return;
            }
        }
        console.log('User is not in database, attempting to add user...');
        // DATA VALIDATION TO DOOOO
        setUserData(prompt("Please enter your name", ""),0.0,10000);
    },(err)=>console.log(err));
}