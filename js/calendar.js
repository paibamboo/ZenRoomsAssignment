
var calendar = function () {
    var curDate = new Date();

    function getDatesInMonth(month, year) {
        var date = new Date(year, month, 1);
        var dates = [];
        while (date.getMonth() === month) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return dates;
    }

    function drawDateCol(date) {
        return '<div class="col-part' + ((date.getDay() === 0 || date.getDay() === 6) ? ' weekend' : '') + '">' + getDayOfWeek(date.getDay()).substring(0, 3) + ' ' + date.getDate() + '</div>';
    }

    function drawPriceOrAvailCol(val) {
        return '<div class="col-part">' + val + '</div>';
    }

    var drawCal = function (month, year) {
        if (!month || !year) {
            month = curDate.getMonth();
            year = curDate.getFullYear();
        }

        var dateRow, singlePriceRow, singleAvailRow, doublePriceRow, doubleAvailRow;
        dateRow = '<div class="row border-btm">';
        singlePriceRow = singleAvailRow = doublePriceRow = doubleAvailRow = '<div class="row">';
        var data = dataFactory.getRoomsData(month, year);
        var dates = getDatesInMonth(month, year);

        for (var i = 0; i < dates.length; i++) {
            dateRow += drawDateCol(dates[i]);

            for (var j = 0; j < data[i].Rooms.length; j++) {
                var room = data[i].Rooms[j];
                if (room.Type === 'Double') {
                    doubleAvailRow += drawPriceOrAvailCol(room.Avail);
                    doublePriceRow += drawPriceOrAvailCol(room.Price);
                } else if (room.Type === 'Single') {
                    singleAvailRow += drawPriceOrAvailCol(room.Avail);
                    singlePriceRow += drawPriceOrAvailCol(room.Price);
                }
            }

            if (i === dates.length - 1) {
                dateRow += '</div>';
                doubleAvailRow += '</div>';
                doublePriceRow += '</div>';
                singleAvailRow += '</div>';
                singlePriceRow += '</div>';
            }
        }

        var result = dateRow + '<div class="row"></div>' + doubleAvailRow + doublePriceRow + '<div class="row"></div>' + singleAvailRow + singlePriceRow;
        return result;
    };

    var getDayOfWeek = function (dayNum) {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayNum];
    };

    var getMonthName = function (monthNum) {
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthNum];
    };

    var getNumDaysOfMonth = function (date) {
        return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
    };

    var getCurDate = function () {
        return curDate;
    };

    var setCurDate = function (date) {
        curDate = date;
    };

    return {
        drawCal: drawCal,
        getDayOfWeek: getDayOfWeek,
        getMonthName: getMonthName,
        getNumDaysOfMonth: getNumDaysOfMonth,
        getCurDate: getCurDate,
        setCurDate: setCurDate
    };
}();