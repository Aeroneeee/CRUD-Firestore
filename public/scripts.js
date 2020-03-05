document.addEventListener('DOMContentLoaded', function() {
    let app = firebase.app();
    let db = app.firestore();

    var modal = document.getElementById("myModal");
    var addBtn = document.getElementById("add-btn");
    var span = document.getElementsByClassName("close")[0];

    var monthInput = document.getElementById("fieldMonth");
    var yearInput = document.getElementById("fieldYear");
    var titleInput = document.getElementById("fieldTitle");
    var authorsInput = document.getElementById("fieldAuthors");
    var adviserInput = document.getElementById("fieldAdviser");

    var tableList = document.getElementById("table-list");

    var searchList = document.getElementById("table-search");
    var searchTitle = document.getElementById("search-title");
    var searchBtn = document.getElementById("search-btn");
    
    var submitBtn = document.getElementById("submit");


    addBtn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const loadItems = () => {
        tableList.innerHTML = "loading...";
        addBtn.disabled = true;
        db.collection("items")
          .orderBy("datecreated")
          .get()
          .then(querySnapshot => {
            tableList.innerHTML = "<tr><th>Month</th><th>Year</th><th>Title</th><th>Authors</th><th>Adviser</th> <th>Date Added</th> <th>Modify</th></tr>";

            addBtn.innerHTML = "Add";
            addBtn.disabled = false;
            
            querySnapshot.forEach(doc => {
        
                renderItem(doc.id,
                    doc.data().month,
                    doc.data().year,
                    doc.data().title,
                    doc.data().authors,
                    doc.data().adviser,
                    doc.data().datecreated
                );

            });
        });
    };

    const renderItem = (id, month, year, title, authors, adviser, date) => {
        let newItem = document.createElement("tr");
        let monthTD = document.createElement("td");
        let yearTD = document.createElement("td");
        let titleTD = document.createElement("td");
        let authorsTD = document.createElement("td");
        let adviserTD = document.createElement("td");
        let dateTD = document.createElement("td");
        let modifyTD = document.createElement("td");

        let monthtxt = document.createTextNode(month);
        let yeartxt = document.createTextNode(year);
        let titletxt = document.createTextNode(title);
        let authorstxt = document.createTextNode(authors);
        let advisertxt = document.createTextNode(adviser);
        let datetxt = document.createTextNode(date);

        monthTD.appendChild(monthtxt);
        yearTD.appendChild(yeartxt);
        titleTD.appendChild(titletxt);
        authorsTD.appendChild(authorstxt);
        adviserTD.appendChild(advisertxt);
        dateTD.appendChild(datetxt);

        newItem.appendChild(monthTD);
        newItem.appendChild(yearTD);
        newItem.appendChild(titleTD);
        newItem.appendChild(authorsTD);
        newItem.appendChild(adviserTD);
        newItem.appendChild(dateTD);

        let deleteNode = document.createElement("button");
        deleteNode.innerHTML = "Remove";
        deleteNode.classList.add("a-btn");
        deleteNode.onclick = () => {
            newItem.innerHTML = "Removing...";
            db.collection("items")
                .doc(id)
                .delete()
                .then(() => {
                    loadItems();
                });
            return false;
        };

        modifyTD.appendChild(deleteNode);

        let saveNode = document.createElement("button");
        saveNode.innerHTML = "Save";
        saveNode.classList.add("a-btn");
        saveNode.onclick = () => {
            newItem.contentEditable = false;

            let monthNew = monthTD.firstChild.nodeValue;
            let yearNew = yearTD.firstChild.nodeValue;
            let titleNew = titleTD.firstChild.nodeValue;
            let authorsNew = authorsTD.firstChild.nodeValue;
            let adviserNew = adviserTD.firstChild.nodeValue;

            db.collection("items").doc(id)
                .update({
                    month: monthNew,
                    year: yearNew,
                    title: titleNew,
                    authors: authorsNew,
                    adviser: adviserNew,
                    datecreated: new Date().getTime()
                })
                .then(() => {
                    loadItems();
                });
            return false;
        };

        let editNode = document.createElement("button");
        editNode.innerHTML = "Edit";
        editNode.classList.add("a-btn");
        editNode.onclick = () => {
            modifyTD.appendChild(saveNode);
            newItem.contentEditable = true;
            
            return false;
        };

        modifyTD.appendChild(editNode);
        
        newItem.appendChild(modifyTD);

        tableList.appendChild(newItem);
    }

    submitBtn.onclick = () => {
        let monthText = monthInput.value;
        let yearText = yearInput.value;
        let titleText = titleInput.value;
        let authorsText = authorsInput.value;
        let adviserText = adviserInput.value;

        if (monthText && yearText && titleText && authorsText && adviserText) {
            db.collection("items").add({
                month: monthText,
                year: yearText,
                title: titleText,
                authors: authorsText,
                adviser: adviserText,
                datecreated: new Date().getTime()
            }).then(docRef => {
                loadItems();
                monthInput.value = "";
                yearInput.value = "";
                titleInput.value = "";
                authorsInput.value = "";
                adviserInput.value = "";
                modal.style.display = "none";
            })
        }
    }
    document.addEventListener('keypress', function (e){
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    searchBtn.onclick = () => {
        searchList.style.visibility = "visible";
        searchList.innerHTML = "loading...";
        searchBtn.disabled = true;
        db.collection("items").orderBy("datecreated").get()
          .then(querySnapshot => {
            searchList.innerHTML = "<tr><th>Month</th><th>Year</th><th>Title</th><th>Authors</th><th>Adviser</th> <th>Date Added</th> <th>Modify</th></tr>";

            searchBtn.innerHTML = "Search";
            searchBtn.disabled = false;
            
            let titleSearchRaw = searchTitle.value;
            let titleSearch = titleSearchRaw.toLowerCase();

            querySnapshot.forEach(doc => {

                let titleStrRaw = doc.data().title;
                let titleStr = titleStrRaw.toLowerCase();

                let str_pos = titleStr.indexOf(titleSearch);

                if (str_pos > -1){
                    
                    let newItem = document.createElement("tr");

                    let monthTD = document.createElement("td");
                    let yearTD = document.createElement("td");
                    let titleTD = document.createElement("td");
                    let authorsTD = document.createElement("td");
                    let adviserTD = document.createElement("td");
                    let dateTD = document.createElement("td");
                    let modifyTD = document.createElement("td");

                    let monthtxt = document.createTextNode(doc.data().month);
                    let yeartxt = document.createTextNode(doc.data().year);
                    let titletxt = document.createTextNode(doc.data().title);
                    let authorstxt = document.createTextNode(doc.data().authors);
                    let advisertxt = document.createTextNode(doc.data().adviser);
                    let datetxt = document.createTextNode(doc.data().date);

                    monthTD.appendChild(monthtxt);
                    yearTD.appendChild(yeartxt);
                    titleTD.appendChild(titletxt);
                    authorsTD.appendChild(authorstxt);
                    adviserTD.appendChild(advisertxt);
                    dateTD.appendChild(datetxt);

                    newItem.appendChild(monthTD);
                    newItem.appendChild(yearTD);
                    newItem.appendChild(titleTD);
                    newItem.appendChild(authorsTD);
                    newItem.appendChild(adviserTD);
                    newItem.appendChild(dateTD);

                    let deleteNode = document.createElement("button");
                    deleteNode.innerHTML = "Remove";
                    deleteNode.classList.add("a-btn");
                    deleteNode.onclick = () => {
                        newItem.innerHTML = "Removing...";
                        db.collection("items")
                            .doc(doc.id)
                            .delete()
                            .then(() => {
                                loadItems();
                            });
                        return false;
                    };

                    modifyTD.appendChild(deleteNode);

                    let saveNode = document.createElement("button");
                    saveNode.innerHTML = "Save";
                    saveNode.classList.add("a-btn");
                    saveNode.onclick = () => {
                        newItem.contentEditable = false;

                        let monthNew = monthTD.firstChild.nodeValue;
                        let yearNew = yearTD.firstChild.nodeValue;
                        let titleNew = titleTD.firstChild.nodeValue;
                        let authorsNew = authorsTD.firstChild.nodeValue;
                        let adviserNew = adviserTD.firstChild.nodeValue;

                        db.collection("items").doc(doc.id)
                            .update({
                                month: monthNew,
                                year: yearNew,
                                title: titleNew,
                                authors: authorsNew,
                                adviser: adviserNew,
                                datecreated: new Date().getTime()
                            })
                            .then(() => {
                                loadItems();
                            });
                        return false;
                    };

                    let editNode = document.createElement("button");
                    editNode.innerHTML = "Edit";
                    editNode.classList.add("a-btn");
                    editNode.onclick = () => {
                        modifyTD.appendChild(saveNode);
                        newItem.contentEditable = true;
                        
                        return false;
                    };

                    modifyTD.appendChild(editNode);
                
                    newItem.appendChild(modifyTD);

                    searchList.appendChild(newItem);
                }
            });
        });
    }

    db.collection("items").orderBy("datecreated")
    .onSnapshot(function(querySnapshot) {
        tableList.innerHTML = "Loading..."
        addBtn.innerHTML = "Add";
        addBtn.disabled = false;
        querySnapshot.forEach(doc => {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            console.log(source + " " + doc.data().title);
            if (source == "Server") {
                renderItem(doc.id,
                    doc.data().month,
                    doc.data().year,
                    doc.data().title,
                    doc.data().authors,
                    doc.data().adviser,
                    doc.data().datecreated
                );
            }
        });
    });

    loadItems();
    
});