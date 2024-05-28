// Get the context of the canvas element we want to select
var ctx = document.getElementById('myChart').getContext('2d');
var counter = 0;
var value1 = 0;
var flag = true;

// Create a new chart
var myChart = new Chart(ctx, {
    type: 'line', // The type of chart we want to create
    data: {
        labels: [], // Initialize with empty labels
        datasets: [{
            label: 'Speed',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            borderColor: 'rgba(255, 165, 0, 1)',
            data: [] // Initialize with empty data
        }, {
            label: 'Reference',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            data: [] // Initialize with empty data
        }]
    },
    options: {
        scales: {
            // x: {
            //     type: 'time', // Use a time scale
            //     time: {
            //         unit: 'second' // Set the time unit to seconds for better visibility of changes
            //     },
            //     title: {
            //         display: true,
            //         text: 'Time'
            //     }
            // },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        }
    }
});


// Function to add data to the chart
function addData(data, index) {
    if (flag){
        counter +=1;
    }
    flag = flag == false;
    if (index == 0){
        value1 = data;
    }else{
        label = counter;
        myChart.data.labels.push(label); // Add new label to labels array
        myChart.data.datasets[0].data.push(value1); // Add new data to dataset
        myChart.data.datasets[1].data.push(data); // Add new data to dataset

        if (myChart.data.labels.length>10){
            myChart.data.labels.shift();
            myChart.data.datasets[0].data.shift();
            myChart.data.datasets[1].data.shift();
        }

        myChart.update(); // Update the chart
    }
}
