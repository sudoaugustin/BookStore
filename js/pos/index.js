const $ = require('jquery');
import ApexCharts from 'apexcharts'
const axios = require('axios');
var monthly_chart_data={};
var monthly_chart_options = {
  series:[],
  chart: {
    toolbar:{
      show:false
    },
    height: 300,
    type: 'area'
  },
  dataLabels: {
  enabled: false
  },
  stroke: {
  curve: 'smooth',
  color:"transparent",
  width:3
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " Ks"
      }
    }
  }
};
var avg_sale_options = {
  series: [],
  chart: {
    toolbar:{
      show:false
    },
    height: 250,
    type: 'area'
  },
  dataLabels: {
  enabled: false
  },
  stroke: {
    color:"transparent",
    curve: 'straight',
    width:3
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " Ks"
      }
    }
  },
  colors:["#607AE3"]
};
var store_session_chart = {
  series: [],
  chart: {
    toolbar:{
      show:false
    },
    type: 'bar',
    height: 300
    },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '35%',
      endingShape: 'rounded'
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  fill: {
    opacity: 1,
  },
  colors: ['#00E676', '#49D9F8']
  };
$(document).ready(()=>{
  var location_arr=window.location.href.split("/"),
      s_id=parseInt(location_arr[location_arr.length-1]);
  var monthly_chart =new ApexCharts(document.querySelector('.total_sales #chart'), monthly_chart_options);
  monthly_chart.render();
  var session_chart = new ApexCharts(document.querySelector(".store_session #chart"), store_session_chart);
  session_chart.render();
  var avg_chart = new ApexCharts(document.querySelector(".average_value #chart"), avg_sale_options);
  avg_chart.render();
  $(".pp_img").click(e=>{
    $(".kit").toggleClass("show");
  });
  $(".kit i").click(e=>{
    const ele=e.delegateTarget,
          id=ele.id,
          location_arr=window.location.href.split("/"),
          s_id=parseInt(location_arr[location_arr.length-1]);
    axios.post("/management",{
      page:id,
      s_id
    }).then(res=>{
      $(".kit").removeClass("show");
      $(".popover").css("display","flex").hide().fadeIn().html(res.data);
      $(".popover .bx-x").click(e=>{
        $(".popover").fadeOut();
      });
    }).catch(e=>console.log(e.response));
  });
  axios.post("/management",{
    page:"getSale",
    s_id
  })
  .then(res=>{
    console.log(res.data);
    $(".total_sales>p .money").html(res.data.saleOfMonth+" Ks");
    var classToAdd="",html="0%";
    if(res.data.saleOfMonth>res.data.saleOfPrevMonth){
      classToAdd="bx-up-arrow-alt";
      html=Math.round(res.data.saleOfMonth/res.data.saleOfPrevMonth)+"%";
    }
    else if(res.data.saleOfMonth==res.data.saleOfPrevMonth){
      classToAdd="bx-minus";
      html="0%";
    }
    else{
      classToAdd="bx-down-arrow-alt";
      html=Math.round(res.data.saleOfPrevMonth/res.data.saleOfMonth)+"%";
    }
    $(".total_sales .indicator").
    removeClass("bx-up-arrow-alt bx-down-arrow-alt bx-minus").
    html(html).
    addClass(classToAdd);
    monthly_chart_data=res.data.sales;
    monthly_chart.updateSeries([{
      name:"Sales",
      data:monthly_chart_data
    }]);
  })
  .catch(err=>console.log(err.response));

  axios.post("/management",{
    page:"getSession",
    s_id
  })
  .then(res=>{
    var html="",classToAdd="",data=res.data;
    if(data.visitOfMonth>data.visitOfPrevMonth){
      html=data.visitOfMonth-data.visitOfPrevMonth;
      classToAdd="bx-up-arrow-alt";
    }
    else if(data.visitOfMonth==data.visitOfPrevMonth){
      html=data.visitOfMonth-data.visitOfPrevMonth;
      classToAdd="bx-minus";
    }
    else{
      html=data.visitorOfPrevMonth-data.visitorOfMonth;
      classToAdd="bx-down-arrow-alt";
    }
    $(".store_session .visitor-indicator").
    removeClass("bx-up-arrow-alt bx-down-arrow-alt bx-minus").
    html(html).
    addClass(classToAdd);

    $(".store_session .trible_row .visitor").
    html(data.visitOfMonth);

    if(data.subscribeOfMonth>data.subscribeOfPrevMonth){
      html=data.subscribeOfMonth-data.subscribeOfPrevMonth;
      classToAdd="bx-up-arrow-alt";
    }
    else if(data.subscribeOfMonth==data.subscribeOfPrevMonth){
      html=data.subscribeOfMonth-data.subscribeOfPrevMonth;
      classToAdd="bx-minus";
    }
    else{
      html=data.subscribeOfPrevMonth-data.subscribeOfMonth;
      classToAdd="bx-down-arrow-alt";
    }
    $(".store_session .subscriber-indicator").
    removeClass("bx-up-arrow-alt bx-down-arrow-alt bx-minus").
    html(html).
    addClass(classToAdd);

    $(".store_session .trible_row .subscribe").
    html(data.subscribeOfMonth);
    console.log(res.data);
    session_chart.updateSeries([{
      name:"Visits",
      data:data.visits
    },{
      name:"Subscribes",
      data:data.subscribes
    }]);
  })
  .catch(err=>console.log(err.response));

  axios.post("/management",{
    page:"getAvgSale",
    s_id
  })
  .then(res=>{
    console.log(res.data);
    $(".average_value>p .avg").html(res.data.avgSales+" Ks");
    avg_chart.updateSeries([{
      name:"Sales",
      data:res.data.sales
    }]);
  })
  .catch(err=>console.log(err.response));


});
