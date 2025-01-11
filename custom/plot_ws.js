var currentMarkerIdWS = null;
var currentPegel = null;

punkte_pegel.on('click', function(e) {
    // Access the clicked feature's properties
    var clickedFeatureWS = e.layer.feature;
    var attributeValueWS = clickedFeatureWS.properties.Intern_Bez;
    currentPegel = clickedFeatureWS.properties.MESSST_BEZ;

    // Update plot if legend has not been added
    if (!legendAdded) {
        updatePlotWS(attributeValueWS);
    }
});

var lastXValue_nominal = null;
var lastXValue = null;
var startXValue = null;
function updatePlotWS(markerId) {
    console.log('Updating ws_plot with marker ID:', markerId);
    currentMarkerIdWS = markerId;

    // Convert timestamp strings to Date objects for x-axis
    // calculations and measured data during preprocessing  are converted to UTC-time which is also displayed on the x axis but it acts like local time zone
    const xValues_messung = Object.keys(ws_messung[markerId]).map(dateStr => new Date(dateStr));
    
    /*
    // it is that complicated to make it time zone aware
    const xValues_messung = Object.keys(ws_messung[markerId]).map(dateStr => {
    const date = new Date(dateStr);
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
    const options = { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = new Intl.DateTimeFormat('de-DE', options).format(utcDate);
    const [day, month, year, hour, minute, second] = formattedDate.match(/\d+/g);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    });
    */


    //const xValues_messung = Object.keys(ws_messung[markerId]);
    const yValues_messung = Object.values(ws_messung[markerId]);
    //console.log(xValues_messung)
    // Calculate the range: last x value and the 48th value before it 
    //startXValue = xValues_messung[Math.max(xValues_messung.length - 49, 0)];
    lastXValue_nominal = xValues_messung[xValues_messung.length - 1]; 
    startXValue = new Date(lastXValue_nominal.getTime() - 18 * 60 * 60 * 1000); // 24 hours before lastX
    lastXValue = new Date(lastXValue_nominal.getTime() + 12 * 60 * 60 * 1000); // 6 or 12 hours after lastX
    
    const xValues_prognose = Object.keys(ws_prognose[markerId]).map(dateStr => new Date(dateStr));
    const yValues_prognose = Object.values(ws_prognose[markerId]);

    const trace1 = {
        x: xValues_messung,
        y: yValues_messung,
        type: 'scatter',
        mode: 'lines',
        name: 'Messung',
        line: { color: '#6d6af2' },
        //hovertemplate: '%{x|%Y-%m-%d %H:%M}<br>Wasserstand: %{y}'
    };

    const trace2 = {
        x: xValues_prognose,
        y: yValues_prognose,
        type: 'scatter',
        mode: 'lines',
        name: 'Prognose',
        line: { color: '#e84f7a' },
        //hovertemplate: '%{x|%Y-%m-%d %H:%M}<br>Wasserstand: %{y}'
    };
    const layout = {
        title: {
            text: `Pegel: ${currentPegel}`,
            //text: `Pegel: ${markerId}`,
            font: {
                family: 'Arial, sans-serif',
                size: 15
            },
            xref: 'paper',
            x: 0.5,
            xanchor: 'center',
            y: 0.98
        },
        xaxis: { rangemode: 'normal', 
            //title: 'Time', 
            tickformat: '%d.%m.%Y %H:%M',
            tickfont: { size: 8 }, 
            range: [startXValue, lastXValue], // Set x-axis range here
        },
        yaxis: { 
            title: {
                text:'Wasserstand [cm]', 
                font: {size:11},
                },
            zeroline: true, 
            rangemode: 'tozero', 
            autorange: true, 
            tickformat: '.0f', 
            tickfont: { size: 10 } ,
        },
        legend: {
            orientation: 'v',
            x: 0.00,
            y: 1.00,
            xanchor: 'left',
            yanchor: 'top',
            font: { size: 9 },
            bgcolor: 'rgba(255,255,255,0.5)'
        },
        
        margin: {
            l: 40,  // left margin
            r: 10,  // right margin
            t: 20,  // top margin
            b: 25   // bottom margin
        },
        hovermode: 'x',
        
    };
    
    Plotly.newPlot('plotWS', [trace1, trace2], layout, { displayModeBar: false });
    showPlotWS();

    toggleZoomButton.onclick = () => { 
        Plotly.relayout('plotWS', { 
        'xaxis.range': [startXValue, lastXValue],
        'yaxis.rangemode': 'tozero',
        'yaxis.autorange': true,
        }); 
    }; 
    
    toggleZoomButton2.onclick = () => { 
        Plotly.relayout('plotWS', { 
        'xaxis.range': [xValues_messung[0], lastXValue],
        'yaxis.rangemode': 'tozero',
        'yaxis.autorange': true,
        }); 
    }; 

}

