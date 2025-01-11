var currentMarkerIdWS = null;
var currentPegel = null;

punkte_pegel.on('click', function(e) {
    // Access the clicked feature's properties
    var clickedFeatureWS = e.layer.feature;
    var attributeValueWS = clickedFeatureWS.properties.MESSST_BEZ;
    //currentPegel = clickedFeatureWS.properties.Intern_Bez;

    // Update plot if legend has not been added
    if (!legendAdded) {
        updatePlotWS(attributeValueWS);
    }
});

function updatePlotWS(markerId) {
    console.log('Updating ws_plot with marker ID:', markerId);
    currentMarkerIdWS = markerId;

    // Convert timestamp strings to Date objects for x-axis
    //const xValues_messung = Object.keys(ws_messung[markerId]).map(dateStr => new Date(dateStr));
    const xValues_messung = Object.keys(ws_messung[markerId]);
    const yValues_messung = Object.values(ws_messung[markerId]);
    //console.log(xValues_messung)

    const trace1 = {
        x: xValues_messung,
        y: yValues_messung,
        type: 'scatter',
        mode: 'lines',
        name: 'Wasserstand, Messung',
        line: { color: '#6d6af2' },
        //hovertemplate: '%{x|%Y-%m-%d %H:%M}<br>Wasserstand: %{y}'
    };

    const trace2 = {
        x: xValues_messung,
        y: yValues_messung,
        type: 'scatter',
        mode: 'lines',
        name: 'Wasserstand, Prognose',
        line: { color: '#6d6af2' },
        //hovertemplate: '%{x|%Y-%m-%d %H:%M}<br>Wasserstand: %{y}'
    };
    const layout = {
        title: {
            //text: `Pegel: ${currentPegel}`,
            text: `Pegel: ${markerId}`,
            font: {
                family: 'Arial, sans-serif',
                size: 15
            },
            xref: 'paper',
            x: 0.5,
            xanchor: 'center',
            y: 1.0
        },
        xaxis: { rangemode: 'normal', 
        font: { size: 20 }, 
        //title: 'Time', 
        tickformat: '%d.%m.%Y %H:%M'},
        
        yaxis: { title: 'Wasserstand [cm]', 
        zeroline: true, 
        //rangemode: 'tozero', 
        autorange: true, 
        tickformat: '.0f', font: { size: 11 } },
        legend: {
            orientation: 'h',
            x: 0.00,
            y: 1.00,
            xanchor: 'left',
            yanchor: 'top',
            font: { size: 9 },
            bgcolor: 'rgba(255,255,255,0.5)'
        },
        
        margin: {
            l: 60,  // left margin
            r: 20,  // right margin
            t: 20,  // top margin
            b: 35   // bottom margin
        },
        hovermode: 'x',
        
    };
    
    Plotly.newPlot('plotWS', [trace1, trace2], layout, { displayModeBar: false });
    document.getElementById('plot').style.display = 'none';
    //document.getElementById('plotWS').style.display = 'block'; // Ensure the plot is visible when updating
    //document.getElementById("buttonRow").classList.remove("invisible"); 
    showPlotWS();
}

