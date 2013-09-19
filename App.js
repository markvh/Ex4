Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        this.getData();
    },
    
   
                    
    
    getData: function() {
        // TODO: wsapi data store; on load, aggregate data
            var store = Ext.create('Rally.data.WsapiDataStore', {
            model: 'User Story',
            autoLoad: true,
            listeners: {
                load: function(store, data, success) {
                    
                    this.aggregateData(data);
                },
                scope: this
            },


            filters: [
            {
            property: 'ScheduleState',
            operator: '=',
            value: 'In-Progress'
            },
                  ],
            });
   
        
    },
    aggregateData: function(storyRecords) {
        // TODO: bucket stories by schedule state; render chart
    
        
        // example data structure format to send to report render function
        var mockData = {        
            'Defined': 0,
            'In-Progress': 0,
            'Completed': 0,
            
        };
        
        Ext.Array.each(storyRecords, function(record) {
            console.log(record.get("ScheduleState"));
            mockData[record.get("ScheduleState")]++;
        });
        
        this.renderChart(mockData);
    },
    renderChart: function(myData) {
        var myChartConfig = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'User Stories'
            },
            subtitle: {
                text: 'Count by Schedule State'
            },
            xAxis: {
                categories: [
                    'User Stories'
                ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count'
                }
            },
            tooltip: {
                headerFormat: '<table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: false,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
        };
        
        var myChartData = {
            series: [{
                name: 'Backlog',
                data: [myData.Defined]
            },{
                name: 'In-Progress',
                data: [myData['In-Progress']]
            }, {
                name: 'Completed',
                data: [myData.Completed]
            }]
        };

        var myChart = Ext.create('Rally.ui.chart.Chart', {
            chartConfig: myChartConfig,
            chartData: myChartData
        });
        
        this.add(myChart);
    }
});
