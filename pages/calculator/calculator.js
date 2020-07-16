
Page({
  data: {
    version: 'old',
    list:[
      { text: '(0<X≤1,500)', num: '3%', otherNum: '0' },
      { text: '(1,500<X≤4,500)', num: '10%', otherNum: '105' },
      { text: '(4,500<X≤9,000)', num: '20%', otherNum: '555' },
      { text: '(9,000<X≤35,000)', num: '25%', otherNum: '1005' },
      { text: '(35,000<X≤55,000)', num: '30%', otherNum: '2755' },
      { text: '(55,000<X≤80,000)', num: '35%', otherNum: '5505' },
      { text: '(X>80,000)', num: '40%', otherNum: '13505' },
    ],
    tax: '', //税率
    taxMoney: '', //速算扣除数
    money: '', //税前工资
    firMoney: '', //应纳所得额
    lastMoney:'',//应缴税款
    insurance: '', //五险一金
    num: '',//税后薪资
  },
  onLoad: function (options) {

  },
  changeTab(e) {//起征点切换
    this.setData({
      version: e.currentTarget.dataset.type
    })
    this.computerMoney()
  },
  changeInsurance(e) {
    let val = e.detail.value //五险一金
    this.setData({
      insurance: val
    })
    this.computerMoney()
  },
  changeMoney(e) {
    let val = e.detail.value //税前薪资
    this.setData({
      money: val
    })
    this.computerMoney()
  },
  computerMoney() {
    let tax = ''
    let taxMoney = ''
    if (this.data.version == 'old' && this.data.money && this.data.insurance) {//3500起征点
      let lastNum = this.data.money - this.data.insurance - 3500 //纳税额
      if (lastNum <= 1500) {
        tax = 3
        taxMoney = 0
      } else if (lastNum > 1500 && lastNum <= 4500) {
        tax = 10
        taxMoney = 105
      } else if (lastNum > 4500 && lastNum <= 9000) {
        tax = 20
        taxMoney = 555
      } else if (lastNum > 9000 && lastNum <= 35000) {
        tax = 25
        taxMoney = 1005
      } else if (lastNum > 35000 && lastNum <= 55000) {
        tax = 30
        taxMoney = 2755
      } else if (lastNum > 55000 && lastNum <= 80000) {
        tax = 35
        taxMoney = 5505
      } else if (lastNum > 80000) {
        tax = 45
        taxMoney = 13505
      }
      this.setData({
        tax: tax,
        taxMoney: taxMoney,
        firMoney: lastNum,
        lastMoney: lastNum * tax * 0.01 - taxMoney,
        num: this.data.money - this.data.insurance - (lastNum * tax * 0.01 - taxMoney)
      })
    } else if (this.data.version == 'new' && this.data.money && this.data.insurance) {//5000起征点
      let lastNum = this.data.money - this.data.insurance - 5000 //纳税额
      if (lastNum <= 3000) {
        tax = 3
        taxMoney = 0
      } else if (lastNum > 3000 && lastNum <= 12000) {
        tax = 10
        taxMoney = 210
      } else if (lastNum > 12000 && lastNum <= 25000) {
        tax = 20
        taxMoney = 1410
      } else if (lastNum > 25000 && lastNum <= 35000) {
        tax = 25
        taxMoney = 2660
      } else if (lastNum > 35000 && lastNum <= 55000) {
        tax = 30
        taxMoney = 4410
      } else if (lastNum > 55000 && lastNum <= 80000) {
        tax = 35
        taxMoney = 7160
      } else if (lastNum > 80000) {
        tax = 45
        taxMoney = 15160
      }
      this.setData({
        tax: tax,
        taxMoney: taxMoney,
        firMoney: lastNum,
        lastMoney: lastNum * tax * 0.01 - taxMoney,
        num: this.data.money - this.data.insurance - (lastNum * tax * 0.01 - taxMoney)
      })
    }
  },
})