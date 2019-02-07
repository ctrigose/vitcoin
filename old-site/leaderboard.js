let btc, btc_price,str;
let accounts = [];
let table_;

function preload(){
    getAllAccounts();
}
function setup(){
    get_btc();
    table_ = document.getElementById("table_");
}

function draw(){
    if(frameCount%100){
        get_btc();
    }
}
function getAllAccounts(){
    db_ref = firebase.database().ref('users');
    db_ref.on('value',gotData,(err)=>console.log(err));
}

function gotData(data) {
    console.log(data.val());
    let acc = data.val();
    let keys = Object.keys(data.val());
    for(key of keys){
        console.log(key);
        accounts.push(acc[key]);
    }
}
function accounts_to_table(){

    // language=HTML
    str = "<h2>Who's worth the most?</h2>\n" +
        "                <div class=\"table-responsive\">\n" +
        "                    <table class=\"table table-striped\">\n" +
        "                        <thead>\n" +
        "                            <tr>\n" +
        "                                <th>#</th>\n" +
        "                                <th>Name</th>\n" +
        "                                <th>BTC</th>\n" +
        "                                <th>USD</th>\n" +
        "                                <th>Worth</th>\n" +
        "                            </tr>\n" +
        "                        </thead>\n" +
        "                        <tbody>";
    let place = 1;
    for(let user of accounts){
        str+="<tr><td>"+place+"</td><td>"+user.name+"</td><td>"+Math.round(user.btc_balance * 1000) / 1000+"</td><td>"+Math.round(user.usd_balance * 100) / 100+"</td><td>"+Math.round((user.btc_balance*btc_price+user.usd_balance) * 100) / 100 +"</td></tr>";
        place++;
    }
    str+="</tbody>\n" +
        "                    </table>\n" +
        "                </div>";
    table_.innerHTML=str;
}
function sortAccounts(){
    let temp_array = [];
    let max;
    for(let user of accounts){

    }
}
function get_btc(){
    btc = loadJSON('https://api.gdax.com/products/BTC-USD/ticker', (bitcoin)=>{
        btc_price=(parseFloat(bitcoin.ask));
        accounts_to_table();
        //console.log(bitcoin);
    });
}
