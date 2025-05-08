// ==UserScript==
// @name         亚马逊ABA数据自动下载
// @namespace    http://tampermonkey.net/
// @version      2024-12-23
// @description  try to take over the world!
// @author       You
// @match        https://sellercentral.amazon.co.uk/*
// @require      https://scriptcat.org/lib/513/2.0.1/ElementGetter.js#sha256=V0EUYIfbOrr63nT8+W7BP1xEmWcumTLWu2PXFJHh5dg=
// @icon         data:image/gifbase64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
// 获取元素 循环 下载
(function () {
    'use strict';
    const timeRange = ['quarterly', 'monthly', 'weekly', 'daily']
    const timeRangeYear = ['2024', '2023', '2022']
    const timeRangeQuarter = ['03-31', '06-30', '09-30', '12-31']
    const searchTerm = ['gloves', 'hair dryer']
    function checkObj(selector, timeInterval, fn) {
        let targetElement = null
        let t = setInterval(function () {
            targetElement = document.querySelector(selector)
            if (targetElement) {
                fn(targetElement)
                clearInterval(t)
            }
        }, timeInterval)
        return targetElement
    }
    // timeRange
    const value1 = checkObj(".css-cyf03k #reporting-range", 1000, function (obj) {
        // shadowDom操作
        var shadowRoot1 = document.querySelector('.css-cyf03k #reporting-range').shadowRoot.querySelector('.kat-select-container')
        setTimeout(() => {
            obj.setAttribute('value', timeRange[0])
            obj.dispatchEvent(new Event("change", { bubbles: true }))
        }, 1500)
    })
    // 年
    const value2 = checkObj(".css-cyf03k #quarterly-year", 1000, (obj) => {
        setTimeout(() => {
            obj.setAttribute('value', timeRangeYear[0])
            obj.dispatchEvent(new Event("change", { bubbles: true }))
        }, 1500)
    })
    // 季度 id=#2024-quarter有报错 改成了css形式
    const value3 = checkObj(".css-owk1mx .css-cyf03k .css-xccmpe", 1000, (obj) => {
        // `${}`出现报错
        obj.setAttribute('value', timeRangeYear[0] + "-" + timeRangeQuarter[0])
        obj.dispatchEvent(new Event("change", { bubbles: true }))
    })
    // 点击搜索
    checkObj(".css-1oy4rvw", 1000, (obj) => {
        setTimeout(() => {
            obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }))
        }, 1000)
    })
    // 点击: 生成下载1
    checkObj(".css-1bvc4cc #GenerateDownloadButton", 1000, (obj) => {
        obj.setAttribute("label", "下载1")
        setTimeout(() => {
            obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }))
        }, 1000)
    })
    // 点击: 生成下载2
    checkObj(".css-ivrut9 .css-ja60r3 .css-1nln1ln", 1000, (obj) => {
        obj.setAttribute("label", "下载2")
        setTimeout(() => {
            obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }))
        }, 1000)
    })
    // 点击: 关闭
    checkObj(".css-ivrut9 .css-ja60r3 kat-button", 1000, (obj) => {
        setTimeout(() => {
            obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }))
        }, 3000)
    })
    // 进入循环——季度
    // 季度 id=#2024-quarter有报错 改成了css形式
    checkObj(".css-owk1mx .css-cyf03k .css-xccmpe", 1000, (obj) => {
        // `${}`出现报错
        obj.setAttribute('value', timeRangeYear[0] + "-" + timeRangeQuarter[1])
        obj.dispatchEvent(new Event("change", { bubbles: true }))
    })
})();

// 思路1:修改value值
/**
 * 
 * @param {*} selector 
 * @param {*} timeInterval 
 * @param {*} fn 
function checkObj(selector, timeInterval, fn) {
let t = setInterval(function () {
    // 动态查找
    let targetElement = document.querySelector(selector)
    //设定循环定时器，1000毫秒=1秒，1秒钟检查一次目标对象是否出现
    if (targetElement) {
        //判断对象是否存在，存在则开始设置值
        fn(targetElement)
        clearInterval(t) //清除循环定时器
    }
}, timeInterval)
}
// 执行函数 代码错误 页面中的目标元素是动态加载的（比如通过 AJAX），在调用 document.querySelector 时可能会返回 null，从而导致 checkObj 的判断始终失败。
// let targetElement = document.querySelector(".css-cyf03k #reporting-range")
checkObj(".css-cyf03k #reporting-range", 1000, function (obj) {
    // js原生点击
    obj.setAttribute('value', 'weekly')
})
 */


// 思路2:绑定点击事件————行不通
/**
 * function checkObj(selector, timeInterval, fn) {
    let t = setInterval(function () {
        // 动态查找
        let targetElement = document.querySelector(selector)
        //设定循环定时器，1000毫秒=1秒，1秒钟检查一次目标对象是否出现
        if (targetElement) {
            //判断对象是否存在，存在则开始设置值
            fn(targetElement)
            clearInterval(t) //清除循环定时器
        }
    }, timeInterval)
}
// 执行函数 代码错误 页面中的目标元素是动态加载的（比如通过 AJAX），在调用 document.querySelector 时可能会返回 null，从而导致 checkObj 的判断始终失败。
// let targetElement = document.querySelector(".css-cyf03k #reporting-range")
checkObj(".css-cyf03k #reporting-range", 1000, function (obj) {
    // js原生点击
setTimeout(() => {
    var ev = new Event("click", { bubbles: true, cancelable: false })
    obj.dispatchEvent(ev)
}, 2000)
    obj.addEventListener('click',function() {
        alert('绑定事件监听函数')
    })
})
 */

// 思路3:模拟点击x, y轴的数据————行不通
/**
 * 
document.addEventListener('click', (e) => {
    console.log(e.target)
})

// 创建一个点击事件
const cclick = (x, y) => {
    const ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    })

    // 获取指定坐标上的元素
    const el = document.elementFromPoint(x, y)
    // 分发点击事件
    el.dispatchEvent(ev)
}

// var shadowRoot1 = document.querySelector('.css-cyf03k #reporting-range').shadowRoot.querySelector('.kat-select-container')
function checkObj(selector, timeInterval, fn) {
    let t = setInterval(function () {
        // 动态查找
        let targetElement = document.querySelector(selector)
        //设定循环定时器，1000毫秒=1秒，1秒钟检查一次目标对象是否出现
        if (targetElement) {
            //判断对象是否存在，存在则开始设置值
            fn(targetElement)
            clearInterval(t) //清除循环定时器
        }
    }, timeInterval)
}
// 执行函数 代码错误 页面中的目标元素是动态加载的（比如通过 AJAX），在调用 document.querySelector 时可能会返回 null，从而导致 checkObj 的判断始终失败。
// let targetElement = document.querySelector(".css-cyf03k #reporting-range")
checkObj(".css-cyf03k #reporting-range", 1000, function (obj) {
    const attr = document.createAttribute('expanded')
    obj.setAttributeNode(attr)
    var shadowRoot1 = document.querySelector('.css-cyf03k #reporting-range').shadowRoot.querySelector('.kat-select-container')
    // var optionContent = shadowRoot1.querySelectorAll('.select-options')
    // 调用点击函数
    // expanded 加上之后才click点击
    setTimeout(() => {
        // cclick(210, 370)
        var reportingRange = document.querySelectorAll(".css-cyf03k")
        reportingRange[0].getElementsByTagName("kat-dropdown").setAttribute('value', 'quarterly')
    }, 2000)
})
*/

// tool: shadow-root解决方法
var shadowRoot1 = document.querySelector('.css-cyf03k #reporting-range').shadowRoot.querySelector('.kat-select-container')

// tool: dom属性添加(不带值)
const attr = document.createAttribute('primary')
const ele = document.createElement('div')
ele.setAttributeNode(attr)

// tool: select|option框的 click事件和change事件
var reportingRange = document.querySelectorAll(".css-cyf03k")
reportingRange[0].getElementsByTagName("kat-dropdown").setAttribute('value', 'quarterly')
reportingRange[0].getElementsByTagName("kat-dropdown").setAttribute('selectedIndex', '4')
reportingRange[0].getElementsByTagName("kat-dropdown").dispatchEvent(new Event("change", { bubbles: true }))

// tool: 模拟点击操作
var ev = new Event("click", { bubbles: true, cancelable: false })
obj.dispatchEvent(ev)

    // 关键词————JS操作不了 1.shadow-root(user-agent) 2.双层input中间有代理 3.可能使用了框架(maybe存在转发)
    /**
     *
    const value4 = checkObj(".css-owk1mx .css-m3h2rj .css-14r34si", 1000, (obj) => {
        obj.setAttribute('value', searchTerm[0])
        // 创造事件
        obj.dispatchEvent(new Event("focus", { 'bubbles': true, }))
        obj.dispatchEvent(new Event("input", { 'bubbles': true, }))
        obj.dispatchEvent(new Event("change", { 'bubbles': true, }))
        obj.dispatchEvent(new Event("blur", { 'bubbles': true, }))
    })
     */
    // 点击关闭dialog 判断出错
    /**
     * 
    function checkElement(selector, timeInterval, fn) {
        let t = setInterval(function () {
            let targetElement1 = document.querySelector(selector)
            let targetElement2 = document.querySelector(".css-ivrut9 .css-ja60r3 kat-button")
            let element = targetElement1.getAttribute("label")
            if (targetElement2 && element == '打开下载管理器') {
                fn(targetElement2)
                clearInterval(t)
            }
        }, timeInterval)
    }
    checkElement(".css-ivrut9 .css-ja60r3 .css-1nln1ln", 1000, "label", (obj) => {
        let t = setInterval(function () {
            setTimeout(() => {
                obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }))
            }, 1000)
            obj.addEventListener('click', function () {
                alert('点击 事件 4')
            })
        })
    })
     */
    // alert重写
    /***
     * alert重写
     * 
        document.addEventListener('click', (e) => {
            alert(e.target)
        })
        const selfAlert = window.alert
        const { toString } = Object.prototype
        window.alert = (args) => {
        let content = null
        if (toString.call(args) === "[object HTMLDocument]") {
            // document
            content = document.querySelector('*').outerHTML
        } else if (toString.call(args) === "[object Window]") {
            // window
            const obj = {}
            for(let key in window) {
            const item = window[key]
            obj[key] = item ? item.toString() : item
            }
            content = JSON.stringify(obj)
        } else if (/\[object (.*?)Element\]$/.test(toString.call(args))) {
            // 若是dom元素，则输出当前及其子元素的html
            content = args.outerHTML
        } else if (typeof args==='object') {
            // 若是array或者object类型
            content = JSON.stringify(args)
        } else {
            content = args
        }
        selfAlert(content)
        }
     */

(function () {
    'use strict';

    const config = {
        timeRange: ['quarterly', 'monthly', 'weekly', 'daily'],
        timeRangeYear: ['2024', '2023', '2022'],
        timeRangeQuarter: ['03-31', '06-30', '09-30', '12-31'],
        searchTerm: ['gloves', 'hair dryer']
    };

    function checkObj(selector, timeInterval, fn) {
        let t = setInterval(function () {
            const targetElement = document.querySelector(selector);
            if (targetElement) {
                fn(targetElement);
                clearInterval(t);
            }
        }, timeInterval);
    }

    // 修改value、执行auto操作
    function setAttributeAndDispatchEvent(obj, attribute, value, eventType = "change", delay = 1500) {
        setTimeout(() => {
            obj.setAttribute(attribute, value);
            obj.dispatchEvent(new Event(eventType, { bubbles: true }));
        }, delay);
    }

    // 
    function processYearsAndQuarters(years, quarters) {
        // 年+季度 循环
        years.forEach(year => {
            quarters.forEach(quarter => {
                const quarterValue = year+"-"+quarter;
                // Update quarterly dropdown
                checkObj(".css-owk1mx .css-cyf03k .css-xccmpe", 1000, (obj) => {
                    setAttributeAndDispatchEvent(obj, 'value', quarterValue);
                });
            });
        });
    }

    // TimeRange Dropdown
    checkObj(".css-cyf03k #reporting-range", 1000, (obj) => {
        setAttributeAndDispatchEvent(obj, 'value', config.timeRange[0]);
    });

    // Year Dropdown
    checkObj(".css-cyf03k #quarterly-year", 1000, (obj) => {
        setAttributeAndDispatchEvent(obj, 'value', config.timeRangeYear[0]);
    });

    // Process years and quarters
    processYearsAndQuarters(config.timeRangeYear, config.timeRangeQuarter);

    // Search Button
    checkObj(".css-1oy4rvw", 1000, (obj) => {
        obj.setAttribute("label", "点击");
        setTimeout(() => {
            obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
        }, 1000);
    });

    // Generate Download Buttons
    const downloadButtons = [
        { selector: ".css-1bvc4cc #GenerateDownloadButton" },
        { selector: ".css-ivrut9 .css-ja60r3 .css-1nln1ln" }
    ];

    downloadButtons.forEach(({ selector }) => {
        checkObj(selector, 1000, (obj) => {
            setTimeout(() => {
                obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
            }, 1000);
        });
    });

    // 一定要执行完之后才能下一次
    // Close Button
    checkObj(".css-ivrut9 .css-ja60r3 kat-button", 1000, (obj) => {
        setTimeout(() => {
            obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
        }, 3000);
    });
})();



/**
 * (function () {
    'use strict';
    const timeRange = ['quarterly', 'monthly', 'weekly', 'daily']
    const timeRangeYear = ['2024', '2023', '2022']
    const timeRangeQuarter = ['03-31', '06-30', '09-30', '12-31']
    const searchTerm = ['gloves', 'hair dryer']
    function checkObj(selector, timeInterval, fn) {
        let targetElement = null
        let t = setInterval(function () {
            targetElement = document.querySelector(selector)
            if (targetElement) {
                fn(targetElement)
                clearInterval(t)
            }
        }, timeInterval)
        return targetElement
    }
    // 重写alert
    const selfAlert = window.alert
    const { toString } = Object.prototype
    window.alert = (args) => {
        let content = null
        if (toString.call(args) === "[object HTMLDocument]") {
            // document
            content = document.querySelector('*').outerHTML
        } else if (toString.call(args) === "[object Window]") {
            // window
            const obj = {}
            for(let key in window) {
                const item = window[key]
                obj[key] = item ? item.toString() : item
            }
            content = JSON.stringify(obj)
        } else if (/\[object (.*?)Element\]$/.test(toString.call(args))) {
            // 若是dom元素，则输出当前及其子元素的html
            content = args.outerHTML
        } else if (typeof args==='object') {
            // 若是array或者object类型
            content = JSON.stringify(args)
        } else {
            content = args
        }
        selfAlert(content)
    }
    // timeRange
    const value1 = checkObj(".css-cyf03k #reporting-range", 1000, function (obj) {
        // shadowDom操作
        let shadowRoot1 = document.querySelector('.css-cyf03k #reporting-range').shadowRoot.querySelector('.kat-select-container')
        obj.setAttribute('value', timeRange[0])
        obj.dispatchEvent(new Event("change", { bubbles:true }))
    })
    // 年
    const value2 = checkObj(".css-cyf03k #quarterly-year", 1000, (obj) => {
        obj.setAttribute('value', timeRangeYear[0])
        obj.dispatchEvent(new Event("change", { bubbles:true }))
    })
    // 季度 id=#2024-quarter有报错 改成了css形式
    const value3 = checkObj(".css-owk1mx .css-cyf03k .css-xccmpe", 1000, (obj) => {
        obj.setAttribute('value', timeRangeYear[0] + '-' + timeRangeQuarter[0])
        obj.dispatchEvent(new Event("change", { bubbles: true }))
    })
    // 点击：搜索
    checkObj(".css-1oy4rvw", 1000, (obj) => {
        // obj.setAttribute("label", "点击")
        setTimeout(() => {
            obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }))
        }, 2000)
        obj.addEventListener('click', function () {
            // alert('点击 事件1')
        })
    })
    // 点击: 生成下载1
    checkObj(".css-1bvc4cc #GenerateDownloadButton", 1000, (obj) => {
        // obj.setAttribute("label", "下载1")
        setTimeout(() => {
            obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }))
        }, 2000)
        obj.addEventListener('click', function () {
            // alert('点击 事件 2')
        })
    })
    // 点击: 生成下载2
    checkObj(".css-ivrut9 .css-ja60r3 .css-1nln1ln", 1000, (obj) => {
        // obj.setAttribute("label", "下载2")
        setTimeout(() => {
            obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }))
        }, 1000)
        obj.addEventListener('click', function () {
            // alert('点击 事件 3')
        })
    })
    checkObj(".css-ivrut9 .css-ja60r3 kat-button", 1000, (obj) => {
        setTimeout(() => {
            obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }))
        }, 3000)
        obj.addEventListener('click', function () {
            // alert('点击 事件 4')
        })
    })
})();
 */