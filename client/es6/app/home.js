import ApexCharts from "apexcharts";
const chart = {
  sale: (data) => ({
    series: [
      {
        name: "Sales",
        data,
      },
    ],
    chart: {
      height: 300,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      color: "transparent",
      width: 3,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " Ks";
        },
      },
    },
    yaxis: {
      title: {
        text: "Kyats",
      },
    },
  }),
  order: (data) => ({
    series: [
      {
        name: "Orders",
        data,
      },
    ],
    chart: {
      toolbar: {
        show: true,
      },
      type: "bar",
      height: 300,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    yaxis: {
      title: {
        text: "Orders",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#00E676", "#49D9F8"],
  }),
};
const renderCharts = ({ sales, orders }) => {
  new ApexCharts(
    document.querySelector(".sales #chart"),
    chart.sale(sales)
  ).render();
  new ApexCharts(
    document.querySelector(".orders #chart"),
    chart.order(orders)
  ).render();
};

const sale_chart = ({ amount, net, up }) => `<div class="sales chart">
                                                <h3>Sales</h3>
                                                <div class="flex row space_between y_center full">
                                                    <h1>${amount + "Ks"}</h1>
                                                    <h2 class="indicator ${
                                                      up ? "up" : "down"
                                                    }">
                                                        <i class="bx bx-down-arrow-alt "></i>
                                                        <span>${
                                                          net + "%"
                                                        }</span>
                                                    </h2>
                                                </div>
                                                <div id="chart"></div>
                                            </div>`;
const order_chart = ({ amount, net, up }) => `<div class="orders chart">
                                                    <h3>Orders</h3>
                                                    <div class="flex row space_between y_center full">
                                                        <h1>${amount}</h1>
                                                        <h2 class="indicator ${
                                                          up ? "up" : "down"
                                                        }">
                                                            <i class="bx bx-${
                                                              up ? "up" : "down"
                                                            }-arrow-alt "></i>
                                                            <span>${
                                                              net + "%"
                                                            }</span>
                                                        </h2>
                                                    </div>
                                                    <div id="chart"></div>
                                              </div>`;
const overview = ({ sale, order }) => `<div>
                                            <h2>Overview</h2>
                                            <div class="flex wrap">
                                               ${sale_chart(sale)}
                                               ${order_chart(order)}
                                            </div>
                                       </div>`;
const bookshelf = () => `
                <div>
                    <h2>Recent publish</h2>
                    <div class="bookshelf"></div>
                </div>`;
const Home = ({ sale, order }) => `${overview({ sale, order })} ${bookshelf()}`;
export { Home, renderCharts };
