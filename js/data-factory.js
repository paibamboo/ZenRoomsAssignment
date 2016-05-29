var dataFactory = function () {
    function createXHR() {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        return xhr;
    }

    var updateRoomData = function (date, month, year, roomType, label, value) {

    }();

    var getRoomsData = function (month, year, onSuccess, onError) {
        var xhr = createXHR();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                onSuccess(jsonResponse);
            } else if (xhr.readyState === 4 && xhr.status >= 400) {
                onError(xhr.responseText);
            }
        };
        xhr.open('GET', 'api/rooms.php?month=' + (month + 1) + '&year=' + year, true);
        xhr.send();
    };

    return {
        getRoomsData: getRoomsData,
        updateRoomData: updateRoomData
    };
}();