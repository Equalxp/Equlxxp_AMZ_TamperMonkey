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
    const config = {
        timeRange: ['quarterly', 'monthly', 'weekly', 'daily'],
        timeRangeYear: ['2024', '2023'],
        timeRangeQuarter: ['03-31', '06-30', '09-30', '12-31'],
        searchTerm: ['gloves', 'hair dryer']
    };

    // bug: 有异步问题
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
    function setAttrAndDispatchEv(obj, attr, value, eventType = "change") {
        obj.setAttribute(attr, value);
        obj.dispatchEvent(new Event(eventType, { bubbles: true }));
    }

    function clickEvent() {
        // search
        checkObj(".css-1oy4rvw", 1000, (obj) => {
            obj.setAttribute("label", "点击1-应用");
            setTimeout(() => {
                obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
            }, 1000);
        });
        // download-1 & download-2
        const downloadButtons = [
            { selector: ".css-1bvc4cc #GenerateDownloadButton" },
            { selector: ".css-ivrut9 .css-ja60r3 .css-1nln1ln" }
        ]
        downloadButtons.forEach(({ selector }) => {
            checkObj(selector, 1000, (obj) => {
                setTimeout(() => {
                    obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
                }, 1000);
            });
        })
        //close dialog
        checkObj(".css-ivrut9 .css-ja60r3 kat-button", 1000, (obj) => {
            setTimeout(() => {
                obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
            }, 2000);
        });
    }
    function processYearsAndQuarters(years, quarters) {
        // TimeRange Dropdown
        checkObj(".css-cyf03k #reporting-range", 1000, (obj) => {
            setAttrAndDispatchEv(obj, 'value', config.timeRange[0]);
        });
        years.forEach(year => {
            // Year Dropdown
            checkObj(".css-cyf03k #quarterly-year", 1000, (obj) => {
                setAttrAndDispatchEv(obj, 'value', config.timeRangeYear[0]);
            });
            quarters.forEach(quarter => {
                const quarterValue = year + "-" + quarter;
                alert(quarterValue)
                // Update quarterly dropdown
                checkObj(".css-owk1mx .css-cyf03k .css-xccmpe", 1000, (obj) => {
                    setAttrAndDispatchEv(obj, 'value', quarterValue);
                });
                clickEvent()
            });
        });
    }

    // Process years and quarters
    processYearsAndQuarters(config.timeRangeYear, config.timeRangeQuarter);


})();