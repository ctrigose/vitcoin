let btc, btc_value;
let hist, prices;
let dw, dh, str, d;
let chart;
let account, database, acc, userId, transactions;
let welcome_msg, btc_b, usd_b, buy_b, sell_b;

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
    transactions = [];
    hist = [];
    prices = [];//'prices', 9000, 9010, 9005];
    btc_value = select('#btc_value');

    welcome_msg = select('#welcome');
    btc_b = select('#btc');
    usd_b = select('#usd');

    buy_b = select('#buy');
    sell_b = select('#sell');

    str = "";
    dw = windowWidth;
    dh = windowHeight;
    getBtc();
}

function draw() {

    if(document.getElementById("buy_input").value || document.getElementById("sell_input").value)
        buy_sell_form();

    if (frameCount % 70 == 0) {
        getBtc();
        if(prices.length>2) btc_value.html(prices[prices.length-1][1]);
    }
}

//Data Handling
function buy_sell_form(){
    if (!prices[prices.length - 2][1]) {
        return;
    }
    let total_b = 0;
    let total_s = 0;
    total_b = (prices[prices.length - 2][1] * parseFloat(document.getElementById("buy_input").value)).toLocaleString(
        undefined,
        {minimumFractionDigits: 2}
    );
    total_s = (prices[prices.length - 2][1] * parseFloat(document.getElementById("sell_input").value)).toLocaleString(
        undefined,
        {minimumFractionDigits: 2}
    );

    if(total_b)
        buy_b.html("$" + total_b);
    if(total_s)
        sell_b.html("$" + total_s);
}
function drawGoogleChart() {
    let data = new google.visualization.DataTable();
    data.addColumn('date', 'time');
    data.addColumn('number', 'price');
    //console.log(prices);
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
        pointSize: 6,
        height:300,
        legend: {position: 'none'},
        backgroundColor: { fill:'transparent' }
    };

    let chart = new google.visualization.LineChart(document.getElementById('chart'));

    chart.draw(data, options);
}
function getBtc() {

    btc = loadJSON('https://api.gdax.com/products/BTC-USD/ticker', (bitcoin)=>{
        hist.push(bitcoin);
        prices.push([new Date(bitcoin.time), parseFloat(bitcoin.ask)]);
        //console.log(bitcoin);
    });

    if (frameCount % 3 === 0 && hist.length > 1) {
        //parse2arr();
        drawGoogleChart();
        //c3Chart();
    }
}

//Firebase read write
function buy(amount){
    console.log("buying");
    if (amount === undefined) amount = parseFloat(document.getElementById("buy_input").value);

    if(amount*prices[prices.length-2][1] > account.usd_balance){
        alert('Insufficient funds');
        return;
    }
    if(amount<=0.01){
        alert('Btc amount must be 0.01 or more');
        return;
    }
    let new_btc_balance =  Math.round((account.btc_balance+amount)* 1000) / 1000;
    let new_usd_balance = Math.round((account.usd_balance-amount*parseFloat(btc.ask))* 1000) / 1000;
    let details = {
        type:"buy",
        btc_amount:amount,
        usd_per_btc:parseFloat(btc.ask),
        usd_value: amount*parseFloat(btc.ask),
        date: btc.time
    };
    console.log(details);
    transactions.push(details);
    console.log("New btc balance: "+new_btc_balance);
    console.log("New usd balance: "+new_usd_balance);

    userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId).set({
        name:account.name,
        btc_balance : new_btc_balance,
        usd_balance: new_usd_balance,
        transactions: transactions
    });

    console.log("FIREBASE UPDATED");
    account.btc_balance=new_btc_balance;
    account.usd_balance=new_usd_balance;
    btc_b.html("BTC: "+Math.round(account.btc_balance* 1000) / 1000);
    usd_b.html("USD: "+Math.round(account.usd_balance* 10000) /10000);
}
function sell(amount){
    console.log("selling");
    if (amount === undefined) amount = parseFloat(document.getElementById("sell_input").value);
    if(amount > account.btc_balance){
        alert('Insufficient funds');
        return;
    }
    if(amount<=0.01){
        alert('Btc amount must be 0.01 or more');
        return;
    }
    let new_btc_balance = Math.round((account.btc_balance-amount)* 1000) / 1000;
    let new_usd_balance = Math.round((account.usd_balance+amount*parseFloat(btc.ask))* 100) / 100;
    let details = {
        type:"sell",
        btc_amount:amount,
        usd_per_btc:parseFloat(btc.ask),
        usd_value: amount*parseFloat(btc.ask),
        date: btc.time
    };
    console.log(details);
    transactions.push(details);
    console.log("New btc balance: "+new_btc_balance);
    console.log("New usd balance: "+new_usd_balance);

    userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId).set({
        name:account.name,
        btc_balance : new_btc_balance,
        usd_balance: new_usd_balance,
        transactions: transactions
    });
    console.log("FIREBASE UPDATED");
    account.btc_balance=new_btc_balance;
    account.usd_balance=new_usd_balance;
    btc_b.html("BTC: "+Math.round(account.btc_balance* 1000) / 1000);
    usd_b.html("USD: "+Math.round(account.usd_balance* 10000) /10000);
}


//AUTHENTICATION
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userExists();
        getUserData();
    } else {
        console.log("no user logged in");
    }
});
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

    transactions = account.transactions;

    //welcome_msg.html("Welcome, "+account.name);
    btc_b.html("BTC: "+Math.round(account.btc_balance* 1000) / 1000);
    usd_b.html("USD: "+Math.round(account.usd_balance* 10000) /10000);

    /*let usr = data.val();
    let keys = Object.keys(data.val());
    for(key of keys) user_data.push([usr[key].name, usr[key].usd_balance, usr[key].btc_balance]);*/
}
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
        setUserData(prompt("Please enter your name", "snekayturtle"),0.0,10000);
    },(err)=>console.log(err));
}
