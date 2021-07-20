// DESCRIPTION: Covid-19 web page displaying data from JSON file 
// using Promise and Arrow Function. Presenting the data using 
// Chart.js library
//
// AUTHOR: Carrie Aubin
// EMAIL: aubinca@sheridancollege.ca
// CREATED: 2021-06-30
// UPDATED: 2021-07-03
/////////////////////////////////////////////////////////////////////////////////

let go ={};
let data = []; // sorted array by date holding filtered objects
let index = data.length-1;
let dates = []; // array holds dates for charts
let values =[]; // array holds daily cases values for chart
let totalCases=[]; // array holds total cases values for chart

$(document).ready(() =>
{
    // Load JSON
    let option = {
        url:"http://ejd.songho.ca/ios/covid19.json",
        type:"GET",
        dataType:"json"
    };

    // JSON in global variable
    $.ajax(option).then(json => {

        // log("Success: " + json);
        go.json=json;

         // init default setting for combo box
        $("select[name='province'][value='CA']").prop("selectedIndex", 0);
        
        provinceData("Canada");
        drawChart(dates,values);
        drawTotalChart(dates,totalCases);
        updateTable();

        
        // Event handler for selectbox
        $("select").change(function(){
            log($("#province option:selected").text());

            // Get selected province
            let province = $("#province option:selected").text();

            provinceData(province);
            drawChart(dates,values);
            drawTotalChart(dates,totalCases);
            updateTable();
        });

        // Get buttons
        let domPrev = document.getElementById("btnPrev");
        let domNext = document.getElementById("btnNext");

        // Event listener for buttons
        domPrev.addEventListener("click", () => changeDate(-1));
        domNext.addEventListener("click", () => changeDate(1));

    }).catch(() => log("[ERROR] Failed to load JSON"));
});

// Function filters and sorts data for selected province
function provinceData(prov){

    // Filter data by province name
    go.provData= go.json.filter(e => e.prname == prov);

    // sort filtered data by date and store in data array
    data = go.provData.sort((a,b)=>{
        let date1 = new Date(a.date);
        let date2 = new Date(b.date)
        return date1 - date2;
    });

    // get and store values for the charts from filtered data array
    dates = data.map(d => d.date);
    values = data.map(v => v.numtoday);
    totalCases = data.map(t => t.numtotal);

    index = data.length-1;

    // log(data);
    // log("Dates Array: " + dates);
    // log("Values Array: " + values);
    // log("Total Cases Array: " + totalCases)
    
    // update stats placeholders with most recent info
    $("#date").text(data[data.length-1].date);
    $("#dailyStat").html(data[data.length-1].numtoday.toLocaleString('en-US'));
    $("#totalStat").html(data[data.length-1].numtotal.toLocaleString('en-US'));
}

// Function updates table
function updateTable(){

    let html = "";
    let length = data.length-1;
    for(let i = length; i >= 0; i--){

        html += "<tr>" + "<td>" + data[i].date + "</td>" + 
        "<td>" + data[i].numtoday.toLocaleString('en-US') + "</td>" +
        "<td>" + data[i].numtotal.toLocaleString('en-US') + "</td>" +
        "<td>" + data[i].numteststoday.toLocaleString('en-US') + "</td>" +
        "<td>" + data[i].numtests.toLocaleString('en-US') + "</td>" +
        "<td>" + data[i].numdeathstoday.toLocaleString('en-US') + "</td>" +
        "<td>" + data[i].numdeaths.toLocaleString('en-US') + "</td>" + "</tr>";

        // update tbody with html
        $("#tablebody").html(html);
    };
}

// Function to change day
function changeDate(dir){

    if(dir > 0){
        // go to next day
        index = (index + 1) % data.length;
    }else{
        // go to previous day
        index = (index - 1 + data.length) % data.length;
    }

    log("Index: " + index);

     // update stats placeholders
    $("#date").text(data[index].date);
    $("#dailyStat").html(data[index].numtoday.toLocaleString('en-US'));
    $("#totalStat").html(data[index].numtotal.toLocaleString('en-US'));
}

function drawChart(xValues,yValues){
    
    if(go.chart){
        go.chart.destroy();
    }

    let context = document.getElementById("chart").getContext("2d");

    go.chart = new Chart(context,
        {
            type:"line",
            data:
            {
                labels: xValues,
                datasets:
                [{
                    data: yValues, 
                    lineTension: 0,
                    borderColor:"#00ccff",
                    backgroundColor:"#99ebff",
                    fill:true

                }]
            },
            options:
            {
                maintainAspectRatio: false,
                title:
                {
                    display: true,
                    text: "Daily Confirmed Cases",
                    fontSize: 16
                },
                legend:
                {
                    display:false
                }
            }
        });
}

function drawTotalChart(xValues,yValues){

    if(go.chart2){
        go.chart2.destroy();
    }

    let context = document.getElementById("total").getContext("2d");

    go.chart2 = new Chart(context,
        {
            type:"line",
            data:
            {
                labels: xValues,
                datasets:
                [{
                    data: yValues,
                    lineTension: 1,
                    borderWidth:0.5,
                    borderColor:"#ff3300",
                    backgroundColor:"#ff8080",
                    fill:true
                }]
            },
            options:
            {
                maintainAspectRatio: false,
                title:
                {
                    display: true,
                    text: "Total Confirmed Cases",
                    fontSize: 16
                },
                legend:
                {
                    display:false
                }
            }
        });
}
