var img = new Image();
img.src = "/static/img/common/ajax/1474.png"
var timer;
var name;
var pg_count = 0;
var text_size;
$("#search_input").on("input", function(){
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
    table_search();
    }, 200);
});
function table_search(){
    var dbtype = $('#nav_main').text();
    var db_table_name = document.getElementById('search_input').value;
    if (db_table_name.includes('.')){
        if (db_table_name.split(".")[1] == null){
            var Toast = Swal.mixin({
                toast: true,
                position: 'center-center',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: 'error',
                title: "테이블명을 입력해주세요"
            })
        }else {
            var dbn = db_table_name.split(".")[0];
            var tbn = db_table_name.split(".")[1];
        }
    }else {
        if (db_table_name == ''){
            window[dbtype](dbtype);
            return false;
        }else{
            return false;
        }
    }
    de_dbn = 'detail_'+dbn
    cl_tbn = 'classfication_'+dbn
    if($('#'+de_dbn).attr("style").includes('display:none') && dbtype != 'POSTGRES'){
        show_detail(de_dbn, cl_tbn);
    }else if($('#'+cl_tbn).attr("class").includes('right-fill') && dbtype == 'POSTGRES'){
        show_schema(de_dbn, cl_tbn);
    }
    if (dbtype == 'POSTGRES'){
        if(db_table_name.split('.').length - 1 == 2){
            if (!document.getElementById('navigator_'+ dbn +'_table_'+tbn).hasChildNodes()){
                table_detail(dbtype, tbn, tbn, true)
                execute(dbtype, 'i_table_'+tbn, '', true)
                return;
            }
            if (db_table_name.split('.')[2].length == 0){
                execute(dbtype, 'i_table_'+tbn, '', true);
            }
            execute(name, tbn, db_table_name.split('.')[2], true);
            return;
        }
    }
    execute(name,dbn,tbn, true);
    
};

var all_data;

for(let i = 0; i < column_list.length; i++){
    if (column_list[i][0].search(/\s/) != -1){
        column_list[i][0] = column_list[i][0].replace(" ", "");
    }
    window[column_list[i][0]] = function(f_name){
        name = f_name;
        const fieldset = document.getElementById('DB_btn_fieldset');
        connectList = {
            'name' : name,
            'dbname' : all_data_list[0][0],
            'dbtype' : all_data_list[0][1],
            'host' : all_data_list[0][2],
            'port' : all_data_list[0][3],
            'dbuser' : all_data_list[0][4],
            'dbpw' : all_data_list[0][5],
        }
        document.getElementById('search_input').value = null;
        
        $.ajax({
            type : "POST",
            url : "/api/navigator/navigator_database_api/",
            data : {
                'name' : name,
                'dbname' : all_data_list[0][0],
                'dbtype' : all_data_list[0][1],
                'host' : all_data_list[0][2],
                'port' : all_data_list[0][3],
                'dbuser' : all_data_list[0][4],
                'dbpw' : all_data_list[0][5],
            },
            success : function(res){
                pg_count = 0;
                $('html').css("cursor","auto");
                $('#nav_main').text(name);
                fieldset.disabled = false;
                document.getElementById("nav_main").style.display = "inline";
                document.getElementById("Nav_Progress_Loading").style.display = "none";
                var str = "";
                var Table = 'Table'
                
                $.each(res.data, function(i){
                    if (name=='POSTGRES'){
                    str += `<i id="classfication_`+res.data[i]+`" class="bi bi-caret-right-fill menu-list `+res.data[i]+` menu-icon" ondblclick="show_schema('detail_`+res.data[i]+`', 'classfication_`+res.data[i]+`');"><i class="bi bi-file-earmark-text">` + res.data[i] +`</i></i></br>`
                        str += `<div id = "table_Progress_Loading" >`
                            str += `<img src="` + img.src + `">`
                        str += `</div>`
                        
                        str += `<div class="Navi-DF-menu3" style="display:none;" id="detail_`+res.data[i]+`">`
                            str += `<i  class="bi bi-caret-right-fill menu-list menu-list2 menu-icon" 
                                        ondblclick="execute('`+name+`','` + res.data[i] +`','', false);"
                                        style="padding-left:14px;" 
                                        id='`+ res.data[i] +`'>
                                    <i class="bi bi-file-earmark-text" id="folder_table_`+res.data[i]+`">Schema</i>
                                    </i></br>`
                            str += `<div class="Navi-DF-` + res.data[i] +`" id="navigator_table_`+res.data[i]+`" style="padding-left:14px;" postion:relative;">`
                            
                        str += `</div>`
                    }else{
                        str += `<i id="classfication_`+res.data[i]+`" class="bi bi-caret-right-fill menu-list `+res.data[i]+` menu-icon" ondblclick="show_detail('detail_`+res.data[i]+`', 'classfication_`+res.data[i]+`');"><i class="bi bi-file-earmark-text">` + res.data[i] +`</i></i></br>`
                        str += `<div id = "table_Progress_Loading" >`
                            str += `<img src="` + img.src + `">`
                        str += `</div>`
                        
                        str += `<div class="Navi-DF-menu3" style="display:none;" id="detail_`+res.data[i]+`">`
                            str += `<i  class="bi bi-caret-right-fill menu-list menu-list2 menu-icon" 
                                        ondblclick="execute('`+name+`','` + res.data[i] +`','', false);"
                                        style="padding-left:14px;" 
                                        id='`+ res.data[i] +`'>
                                    <i class="bi bi-folder-plus" id="folder_table_`+res.data[i]+`">Table</i>
                                    </i></br>`
                            str += `<div class="Navi-DF-` + res.data[i] +`" id="navigator_table_`+res.data[i]+`" style="padding-left:14px;" postion:relative;">`
                            str += `</div>`

                            str += `<i  class="bi bi-caret-right-fill menu-list menu-list2 menu-icon" 
                                        style="padding-left:14px;"
                                        ondblclick="show_view('`+res.data[i]+`', this);"
                                        id='i_view_` + res.data[i] +`'>
                                    <i class="bi bi-folder-plus" id="folder_view_`+res.data[i]+`">View</i></i></br>`
                            str += `<div class="Navi-DF-` + res.data[i] +`" id="navigator_table_`+res.data[i]+`_view" style="padding-left:14px;" postion:relative;">`
                            str += `</div>`
                            //index
                            str += `<i  class="bi bi-caret-right-fill menu-list menu-list2 menu-icon" 
                            style="padding-left:14px;"
                            ondblclick="show_index('`+res.data[i]+`', this);"
                            id='i_index_` + res.data[i] +`'>
                                    <i class="bi bi-folder-plus" id="folder_index_`+res.data[i]+`">Index</i></i></br>`
                            str += `<div class="Navi-DF-` + res.data[i] +`" id="navigator_table_`+res.data[i]+`_index" style="padding-left:14px;" postion:relative;">`
                            str += `</div>`
                            //procedure
                            str += `<i  class="bi bi-caret-right-fill menu-list menu-list2 menu-icon" 
                                        style="padding-left:14px;"
                                        ondblclick="show_pro('`+res.data[i]+`', this);"
                                        id='i_pro_`+ res.data[i] +`'>
                                    <i class="bi bi-folder-plus" id="folder_pro_`+res.data[i]+`">Procedure</i></i></br>`
                            str += `<div class="Navi-DF-` + res.data[i] +`" id="navigator_table_`+res.data[i]+`_pro" style="padding-left:14px;" postion:relative;">`
                            str += `</div>`
                            str += `</div>`
                    }
                });
                $('#database_table').append(str)
            },
            beforeSend : function(){
                $('html').css("cursor","wait");
                $('#database_table').empty();
                $('#nav_main').empty();
                document.getElementById("nav_main").style.display = "none";
                document.getElementById("Nav_Progress_Loading").style.display = "inline";
                fieldset.disabled = true;
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){
                $('html').css("cursor","auto");
                document.getElementById("nav_main").style.display = "inline";
                document.getElementById("Nav_Progress_Loading").style.display = "none";
                fieldset.disabled = false;
                var Toast = Swal.mixin({
                    toast: true,
                    position: 'center-center',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                Toast.fire({
                    icon: 'error',
                    title: "Failed to get Database properties."
                })
            }
        });
    }
}
window[column_list[0][0]](column_list[0][0]);

function show_detail(f, class_property){
    if($('#'+f).attr("style").includes('display:inline')){
        $('#'+f).attr('style', 'display:none');
        $(class_property).attr('class', 'bi bi-caret-right-fill menu-list `+res.data[i]+` menu-icon ');
    }else{
        $('#'+f).attr('style', 'display:inline');
        $(class_property).attr('class', 'bi bi-caret-down-fill menu-list `+res.data[i]+` menu-icon ');
    }
    if ($('#navigator_table_dbc').width() < 195){
        text_size = 15;
    }else{
        text_size = 20;
    }
}

window.onresize = function() {
    if ($('#navigator_table_dbc').width() < 195){
        text_size = 15;
    }else{
        text_size = 20;
    }
}

function show_schema(f, class_property){
    if($('#'+f).attr("style").includes('display:inline')){
        $('#'+f).attr('style', 'display:none');
        $('#' + class_property).attr('class', 'bi bi-caret-right-fill menu-list `+res.data[i]+` menu-icon ');
    }else{
        $('#'+f).attr('style', 'display:inline');
        $('#' + class_property).attr('class', 'bi bi-caret-down-fill menu-list `+res.data[i]+` menu-icon ');
    }
}
function execute(dbtype, f, tbname, search) {
    if ($('#folder_table_'+f).text() == 'Schema'){
        pg_count = 0;
    }
    if(search==false && $('#'+f).attr("class").includes('down-fill') ){
        $('#'+f).attr('class', 'bi bi-caret-right-fill menu-list `+res.data[i]+` menu-icon ');
        $('#folder_table_'+f.trim()).attr('class', 'bi bi-folder-plus');
        //<i class="bi bi-folder-check"></i>
        if (f.includes("i_table_")) {
            f = f.replace("i_table_", "")
        }
        $('#navigator_table_'+f).empty()
        var str = "";
        str += `<div id = "table_Progress_Loading" >`
            str += `<img src="` + img.src + `">`
        str += `</div>`
        $('#navigator_table_'+f).append(str)
        pg_count = 1;
    }else {
        params = {
            'db' : dbtype,
            'name' : f,
            'tbname' : tbname,
            'count' : pg_count,
        };
    var data_name =  $('#'+f).attr("id");
    if ($('#'+f).attr("class").includes('right-fill') || search==true){
        $.ajax({
            type : "POST",
            url : "/api/navigator/navigator_api/",
            data : params,
            success : function(res){
                $('html').css("cursor","auto");
                $('#navigator_table_'+f).empty()
                document.getElementById("Nav_Progress_Loading").style.display = "none";
                $('#folder_table_'+f.trim()).attr('class', 'bi bi-folder-check');
                if(!$('#'+f).attr("class").includes('bi-file-earmark-text')){
                    $('#'+f).attr('class', 'bi bi-caret-down-fill menu-list menu-list3 menu-icon ');
                };
                var str = "";
                let table_id = '#navigator_table_'+f;
                $.each(res.data, function(i){
                    if (name == 'POSTGRES'){
                        if (pg_count == 0){
                            str += `<i id = "schema_`+String(res.data[i]).trim()+`" class="bi bi-caret-right-fill menu-list `+res.data[i]+` menu-icon"
                                    ondblclick="table_detail('`+ dbtype + `','`+ res.data[i].trim() + `','`+ tbname + `',`+ search +`);" style="padding-left:14px;">`
                            str += `<i id = "`+res.data[i].trim()+`"; class="bi bi-file-earmark-text jb-title`+res.data[i]+` menu-icon " >`
                            if (res.data[i].trim().length >= 20){
                                str += `&nbsp;` + res.data[i].trim().substr(0, 20) + "..." + ''
                            }else{
                                str += `&nbsp;`+  String(res.data[i]).trim() +``
                            }
                            str += `</i></i></br>`
                            str += `<div class="Navi-DF-menu6" id="navigator_postgres_table_`+res.data[i].trim()+`"></div>`
                            str += `</div>`
                        }else {
                            f = f.replace("i_table_", "");
                            str += `<i id = "`+res.data[i].trim()+`"; style="padding-left:25px;" class="bi bi-circle menu-list `+res.data[i]+` menu-icon "
                            ondblclick="properties_view('` +String(f) + `','`+ String(res.data[i]) + `');"`
                            if (res.data[i].trim().length >= text_size){
                                str +=  `onmouseover="text_box_over(event, 'table_box_on`+ res.data[i].trim() +`')" onMouseOut="table_box_down('table_box_on`+ res.data[i].trim() +`')">`
                                str += `&nbsp;` + res.data[i].trim().substr(0, text_size) + "..." + ''
                                str += `<div class="jb-text" id="table_box_on`+res.data[i].trim()+`">`+ res.data[i].trim() +`</div>`
                            }else{
                                str += `>`
                                str += `&nbsp;`+  String(res.data[i]).trim() +``
                            }
                            str += `</i></br>`
                            table_id = '#navigator_table_'+f
                        }
                    }else {
                        str += `<i id = "`+res.data[i].trim()+`"; class="bi bi-circle menu-list `+res.data[i]+` menu-icon jb-title" 
                        ondblclick="properties_view('` +String(f) + `','`+ String(res.data[i]) + `');"
                        style="padding-left:14px;"`
                        if (res.data[i].trim().length >= text_size){
                            str +=  `onmouseover="text_box_over(event, 'table_box_on`+ res.data[i].trim() +`')" onMouseOut="table_box_down('table_box_on`+ res.data[i].trim() +`')">`
                            str += `&nbsp;` + res.data[i].trim().substr(0, text_size) + "..." + ''
                            str += `<div class="jb-text" id="table_box_on`+res.data[i].trim()+`">`+ res.data[i].trim() +`</div>`
                        }else{
                            str += `>`
                            str += `&nbsp;`+  String(res.data[i]).trim() +``
                        }
                        str += `</i></br>`
                        
                    }
                });
                pg_count = 1;
                $(table_id).append(str)
            },
            beforeSend : function(){
                $('html').css("cursor","wait");
                document.getElementById("Nav_Progress_Loading").style.display = "inline";
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){
                $('html').css("cursor","auto");
                $('#navigator_table_'+f).empty()
                document.getElementById("nav_main").style.display = "inline";
                document.getElementById("Nav_Progress_Loading").style.display = "none";
                
                var str = "";
                str += '<span style="padding-left:14px;">No data</span>'
                
                $('#folder_table_'+f.trim()).attr('class', 'bi bi-folder-check');
                if(!$('#'+f).attr("class").includes('bi-file-earmark-text')){
                    $('#'+f).attr('class', 'bi bi-caret-down-fill menu-list menu-list3 menu-icon ');
                };
                $('#navigator_table_'+f).append(str);
            }//error
        });
    }
    }
}
function text_box_over(event, f){
    let x = event.clientX;  // Horizontal
    let y = event.clientY;
    var text_box = document.querySelector("#" + f);
    text_box.style.left = (x-300)+ 'px';
    text_box.style.top = (y-80) + 'px';
    document.getElementById(f).style.display = "inline";
}
function table_box_down(f){
    document.getElementById(f).style.display = "none";
}
function table_detail(dbtype, f, tbname, search){
    if ($('#schema_'+f).attr("class").includes('right-fill') || search==true){
        table_id = '#navigator_postgres_table_'+f;
        if ($('#schema_'+f).attr("class").includes('down-fill')){
            $(table_id).empty();
            $('#schema_'+f).attr('class', 'bi bi-caret-right-fill menu-list menu-list3 menu-icon ');
            return;
        }else{
            $('#schema_'+f).attr('class', 'bi bi-caret-down-fill menu-list menu-list3 menu-icon ');
        }
        var str = "";
        str += `<div class="Navi-DF-menu3" style="display:inline;" id="detail_`+f+`">`
        str += `<i  class="bi bi-caret-right-fill menu-list menu-list2 menu-icon" 
                    ondblclick="execute('`+name+`','i_table_` + f +`','', false);"
                    style="padding-left:28px;" 
                    id='i_table_`+ f +`'>
                <i class="bi bi-folder-plus" id="folder_table_`+f+`">Table</i>
                </i></br>`
        str += `<div class="Navi-DF-` + f +`" id="navigator_table_`+f+`" style="padding-left:14px;" postion:relative;">`
        str += `</div>`

        str += `<i  class="bi bi-caret-right-fill menu-list menu-list2 menu-icon" 
                    style="padding-left:28px;"
                    ondblclick="show_view('`+f+`', this);"
                    id='i_view_` + f +`'>
                <i class="bi bi-folder-plus" id="folder_view_`+f+`">View</i></i></br>`
        str += `<div class="Navi-DF-` + f +`" id="navigator_table_`+f+`_view" style="padding-left:14px;" postion:relative;">`
        str += `</div>`
        //index
        str += `<i  class="bi bi-caret-right-fill menu-list menu-list2 menu-icon" 
        style="padding-left:28px;"
        ondblclick="show_index('`+f+`', this);"
        id='i_index_` + f +`'>
                <i class="bi bi-folder-plus" id="folder_index_`+f+`">Index</i></i></br>`
        str += `<div class="Navi-DF-` + f +`" id="navigator_table_`+f+`_index" style="padding-left:14px;" postion:relative;">`
        str += `</div>`
        //procedure
        str += `<i  class="bi bi-caret-right-fill menu-list menu-list2 menu-icon" 
                    style="padding-left:28px;"
                    ondblclick="show_pro('`+f+`', this);"
                    id='i_pro_`+ f +`'>
                <i class="bi bi-folder-plus" id="folder_pro_`+f+`">Procedure</i></i></br>`
        str += `<div class="Navi-DF-` + f +`" id="navigator_table_`+f+`_pro" style="padding-left:14px;" postion:relative;">`
        str += `</div>`
        str += `</div>`
        $(table_id).append(str)
    }else {
        $('#navigator_postgres_table_'+f).empty()
        $('#schema_'+f).attr('class', 'bi bi-caret-right-fill menu-list menu-list3 menu-icon ');
    }
}
function pro_data(){
    if ($.fn.DataTable.isDataTable('#properties_Table')) {
        $("#properties_Table").remove()
        var str = "";
        str += `<div id = "property_Progress_Loading" >`
        str +=    `<img src="` + img.src + `">`
        str += `</div>`
        str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm">'
        str += '<thead>'
        str += `<tr class="table-dark" id='properties_columns'>`
        str += `</tr>`
        str += `</thead>`
        str += `<tbody id="properties_data">`
        str += `</tbody>`
        str += '</table>'
        $("#pro_view").html(str);
    };

    if (all_data.data_column.length == 0){
        var str = "";
        str += '<th>No Data</th>'
    }else {
        var str = "";
        $.each(all_data.data_column, function(i){
            str += `<th>` + all_data.data_column[i] + `</th>`
        });
    }
    $('#properties_columns').append(str)

    if (all_data.data_column.length == 0){
        var str = "";
        str += `<tr><td>No Data</td></tr>`
    }else{
        var str = "";
        $.each(all_data.data, function(i){
            str += `<tr>`
                $.each(all_data.data[i], function(j){
                    str += `<td>` + all_data.data[i][j] + `</td>`
                });
            str += `</tr>`
        });
    }
    $('#properties_data').append(str);

    handleRenderpropertiesTableData();
}

function pro_col(){
    if ($.fn.DataTable.isDataTable('#properties_Table')) {
        $("#properties_Table").remove()
        var str = "";
        str += `<div id = "property_Progress_Loading" >`
        str +=    `<img src="` + img.src + `">`
        str += `</div>`
        str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm">'
        str += '<thead>'
        str += `<tr class="table-dark" id='properties_columns'>`
        str += `</tr>`
        str += `</thead>`
        str += `<tbody id="properties_data">`
        str += `</tbody>`
        str += '</table>'
        $("#pro_view").html(str);
    };
    
    var str = "";
    str += `<th>#</th>`
    $.each(all_data.columns_column, function(i){
        str += `<th>` + all_data.columns_column[i] + `</th>`
    });
    $('#properties_columns').append(str)

    var str = "";
    $.each(all_data.columns, function(i){
        str += `<tr>`
            str += `<td>` + (i+1) + `</td>`
            $.each(all_data.columns[i], function(j){
                if(j == all_data.columns_column.indexOf('Nullable')){
                    if(all_data.columns[i][all_data.columns_column.indexOf('Nullable')].trim() == 'N'){
                        str += `<th>[V]</th>`
                    }else{
                        str += `<th>[ ]</th>`
                    }
                }else{
                    str += `<td>` + all_data.columns[i][j] + `</td>`
                }
            });
        str += `</tr>`
    });
    $('#properties_data').append(str);
    handleRenderpropertiesTableData();
};

    //source
    function pro_source(){
        if ($.fn.DataTable.isDataTable('#properties_Table')) {
            $("#properties_Table").remove()
            var str = "";
            str += `<div id = "property_Progress_Loading" >`
            str +=    `<img src="` + img.src + `">`
            str += `</div>`
            str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm" >'
            str += '<thead>'
            str += `<tr class="table-dark" id='properties_columns'>`
            str += `<th>`
            str += all_data.source_column
            str += `</th>` 
            str += `</tr>`
            str += `</thead>`
            str += `<tbody id="properties_data" style = "text-align:justify;">`
            str += `</tbody>`
            str += '</table>'
            $("#pro_view").html(str);
        }
        var str = "";
        str += `<tr>`
            str +=  `<td id="source_column">`
            str += all_data.source2
            str +=  `</td>`
        str += `</tr>`
        $('#properties_data').append(str);
        handleRenderpropertiesTableData();
    }
function pro_ddl(){
    if ($.fn.DataTable.isDataTable('#properties_Table')) {
        $("#properties_Table").remove()
        var str = "";
        str += `<div id = "property_Progress_Loading" >`
        str +=    `<img src="` + img.src + `">`
        str += `</div>`
        str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm">'
        str += '<thead>'
        str += `<tr class="table-dark" id='properties_columns'>`
        str += `<th>No</th>`
        str += `<th>type</th>`
        str += `<th><i
                    class="fa-regular fa-clipboard"
                    onclick="copy_sql('ddl_data')"
                    id="clipboard"
                    title="copy"
                    style = "padding-right:20px;"></i>
                data
                </th>`
        str += `</tr>`
        str += `</thead>`
        str += `<tbody id="properties_data">`
        str += `</tbody>`
        str += '</table>'
        $("#pro_view").html(str);
    }
    var str = "";
    str += `<tr>`
            str += `<td>1</td>`
            str +=  `<td class="text-truncate">CREATE</td>`
            str +=  `<td id="ddl_data">`
            str +=              all_data.ddl
            str +=  `</td>`
            str +=  `</td>`
    str += `</tr>`
    $('#properties_data').append(str);
    handleRenderpropertiesTableData();
}

function copy_sql(f){
    var sql = document.getElementById(f).innerText;
    try {
        navigator.clipboard.writeText(sql);
        console.log('복사된 텍스트 내용: ' + sql);
    } catch (err) {
        console.log('복사할 수 없음!');
    }
    const Toast = Swal.mixin({
                toast: true,
                position: 'center-center',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

    Toast.fire({
        icon: 'success',
        title: 'Copied'
    })
}

function pro_index(){
    if ($.fn.DataTable.isDataTable('#properties_Table')) {
        $("#properties_Table").remove()
        var str = "";
        str += `<div id = "property_Progress_Loading" >`
        str +=    `<img src="` + img.src + `">`
        str += `</div>`
        str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm">'
        str += '<thead>'
        str += `<tr class="table-dark" id='properties_columns'>`
        str += `<th>No</th>`
        str += `<th>IndexName</th>`
        str += `<th>Column</th>`
        str += `<th>IndexType</th>`
        str += `</tr>`
        str += `</thead>`
        str += `<tbody id="properties_data">`
        str += `</tbody>`
        str += '</table>'
        $("#pro_view").html(str);
    }
    var str = "";
    for(var i = 0; i < all_data.index.length; i ++){
        str += `<tr>`
            str += `<td>`+(i+1)+`</td>`
            for(var j = 0; j < all_data.index[i].length; j ++){
                if(j > 2){
                    break
                }
                str += `<td>`+all_data.index[i][j]+`</td>`
            }
        str += `</tr>`
    }
    $('#properties_data').append(str);
    handleRenderpropertiesTableData();
}

function pro_uqk(){
    if ($.fn.DataTable.isDataTable('#properties_Table')) {
        $("#properties_Table").remove()
        var str = "";
        str += `<div id = "property_Progress_Loading" >`
        str +=    `<img src="` + img.src + `">`
        str += `</div>`
        str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm">'
        str += '<thead>'
        str += `<tr class="table-dark" id='properties_columns'>`
        str += `<th>No</th>`
        str += `<th>UniqueKeyName</th>`
        str += `<th>Column</th>`
        str += `<th>IndexType</th>`
        str += `</tr>`
        str += `</thead>`
        str += `<tbody id="properties_data">`
        str += `</tbody>`
        str += '</table>'
        $("#pro_view").html(str);
    }
    var str = "";
    for(var i = 0; i < all_data.unique.length; i ++){
        str += `<tr>`
            str += `<td>`+(i+1)+`</td>`
            for(var j = 0; j < all_data.unique[i].length; j ++){
                if(j > 2){
                    break
                }
                str += `<td>`+all_data.unique[i][j]+`</td>`
            }
        str += `</tr>`
    }
    $('#properties_data').append(str);
    handleRenderpropertiesTableData();
}

function pro_fgk(){
    if ($.fn.DataTable.isDataTable('#properties_Table')) {
        $("#properties_Table").remove()
        var str = "";
        str += `<div id = "property_Progress_Loading" >`
        str +=    `<img src="` + img.src + `">`
        str += `</div>`
        str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm">'
        str += '<thead>'
        str += `<tr class="table-dark" id='properties_columns'>`
        str += `<th>No</th>`
        str += `<th>ForeignTable</th>`
        str += `<th>ColumnName</th>`
        str += `<th>Relation</th>`
        str += `<th>PrimaryTable</th>`
        str += `<th>PrimaryColumn</th>`
        str += `</tr>`
        str += `</thead>`
        str += `<tbody id="properties_data">`
        str += `</tbody>`
        str += '</table>'
        $("#pro_view").html(str);
    }
    var str = "";
    for(var i = 0; i < all_data.fgk.length; i ++){
        str += `<tr>`
            str += `<td>`+(i+1)+`</td>`
            for(var j = 0; j < all_data.fgk[i].length; j ++){
                str += `<td>`+all_data.fgk[i][j]+`</td>`
            }
        str += `</tr>`
    }
    $('#properties_data').append(str);
    handleRenderpropertiesTableData();
}

function properties_view(db, tb){
    params = {
        'database' : db,
        'table' : tb
    }

    var db_tb = db + '.' + tb;
    $.ajax({
            type : "POST",
            url : "/api/navigator/property_api/",
            data : params,
            success : function(res){
                var parent = document.querySelector('.Navi-DF-menu3 .bi-check-circle-fill');
                if(parent != null){
                    parent.classList.remove('bi-check-circle-fill');
                    parent.classList.add('bi-circle');
                }
                $('html').css("cursor","auto");
                document.getElementById("property_Progress_Loading").style.display = "none";
                $('#'+tb).attr('class', 'bi bi-check-circle-fill menu-list'+tb+' menu-icon');
                $('#pro_data').attr('class', 'btn-tableProperties fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white active');
                $('#pro_col').attr('class', 'btn-tableProperties fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white');
                $('#pro_ddl').attr('class', 'btn-tableProperties DDL-btn fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white');
                    $('#pro_source').attr('style', 'display:none!important;');
                $('#pro_index').attr('class', 'btn-tableProperties DDL-btn fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white');
                $('#pro_uqk').attr('class', 'btn-tableProperties DDL-btn fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white');
                $('#pro_fgk').attr('class', 'btn-tableProperties DDL-btn fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white');
                    if ($('#pro_data').attr("style").includes('none')){
                        $('#pro_data').attr('style', 'border: 1px solid var(--bs-btn-border-color);');
                    };
                    if ($('#pro_col').attr("style").includes('none')){
                        $('#pro_col').attr('style', 'border: 1px solid var(--bs-btn-border-color);');
                    };
                    if ($('#pro_ddl').attr("style").includes('none')){
                        $('#pro_ddl').attr('style', 'border: 1px solid var(--bs-btn-border-color);');
                    };
                if ($('#pro_index').attr("style").includes('none')){
                    $('#pro_index').attr('style', 'border: 1px solid var(--bs-btn-border-color);');
                };
                if ($('#pro_uqk').attr("style").includes('none')){
                    $('#pro_uqk').attr('style', 'border: 1px solid var(--bs-btn-border-color);');
                };
                if ($('#pro_fgk').attr("style").includes('none')){
                    $('#pro_fgk').attr('style', 'border: 1px solid var(--bs-btn-border-color);');
                };
                
                const fieldset = document.getElementById('nav_btn_fieldset');
                fieldset.disabled = false;
                if ($.fn.DataTable.isDataTable('#properties_Table')) {
                    $("#properties_Table").remove()
                    var str = "";
                    str += `<div id = "property_Progress_Loading" >`
                    str +=    `<img src="` + img.src + `">`
                    str += `</div>`
                    str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm">'
                    str += '<thead>'
                    str += `<tr class="table-dark" id='properties_columns'>`
                    str += `</tr>`
                    str += `</thead>`
                    str += `<tbody id="properties_data">`
                    str += `</tbody>`
                    str += '</table>'
                    $("#pro_view").html(str);
                };
                $('#properties_columns').empty()
                $('#properties_data').empty()
                all_data = res;
                if (res.data_column.length == 0){
                    var str = "";
                    str += '<th>No Data</th>'
                }else {
                    var str = "";
                    $.each(res.data_column, function(i){
                        str += `<th>` + res.data_column[i] + `</th>`
                    });
                }
                $('#properties_columns').append(str)
                if (res.data.length == 0){
                    var str = "";
                    str += `<tr><td>No Data</td></tr>`
                }else{
                    var str = "";
                    $.each(res.data, function(i){
                        str += `<tr>`
                            $.each(res.data[i], function(j){
                                str += `<td>` + res.data[i][j] + `</td>`
                            });
                        str += `</tr>`
                    });
                }
                setCookie('dbtable', String(db_tb), 1);
                $('#properties_data').append(str)
                handleRenderpropertiesTableData();
            },
            beforeSend: function() {
                $('html').css("cursor","wait");
                document.getElementById("property_Progress_Loading").style.display = "inline";
                const fieldset = document.getElementById('nav_btn_fieldset');
                fieldset.disabled = true;
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){
                $('html').css("cursor","auto");
                document.getElementById("nav_main").style.display = "inline";
                document.getElementById("property_Progress_Loading").style.display = "none";
                
                var Toast = Swal.mixin({
                toast: true,
                position: 'center-center',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'error',
                    title: "Failed to get table properties."
                })
            }
        });
}

function show_view(f, class_property){
    if ($(class_property).attr("class").includes('right-fill')){
        $.ajax({
            type : "POST",
            url : "/api/navigator/view/",
            data :{
                'db' : f
            },
            success : function(res){
                $(class_property).attr('class', 'bi bi-caret-down-fill menu-list menu-icon ');
                $('#folder_view_'+f.trim()).attr('class', 'bi bi-folder-check')
                document.getElementById("Nav_Progress_Loading").style.display = "none";
                $('html').css("cursor","auto");
                $('#navigator_table_'+f+'_view').empty()
                var str = "";
                if (res.data.length == 0 ){
                    str += `<span style="padding-left:14px;">No data</span>`
                }else{
                    $.each(res.data, function(i){
                        str += `<i id = "`+res.data[i][1].trim()+`"; style="padding-left:14px;" class="bi bi-circle menu-list`+res.data[i][1]+` menu-icon " 
                        ondblclick="properties_show_view('`+String(f) +`','`+ String(res.data[i][1]) + `');"`
                        if (res.data[i][1].trim().length >= text_size){
                            str +=  `onmouseover="text_box_over(event, 'view_box_on`+ res.data[i][1].trim() +`')" onMouseOut="table_box_down('view_box_on`+ res.data[i][1].trim() +`')">`
                            str += `&nbsp;` + res.data[i][1].trim().substr(0, text_size) + "..." + ''
                            str += `<div class="jb-text" id="view_box_on`+res.data[i][1].trim()+`">`+ res.data[i][1].trim() +`</div>`
                        }else{
                            str += `>`
                            str += `&nbsp;`+  String(res.data[i][1]).trim() +``
                        }
                        str += `</i></br>`
                    });
                }
                $('#navigator_table_'+f+'_view').append(str)

                
            },beforeSend :function(){
                $('html').css("cursor","wait");
                document.getElementById("Nav_Progress_Loading").style.display = "inline";
            }
        });
    }else {
        $(class_property).attr('class', 'bi bi-caret-right-fill menu-list menu-icon ');
        $('#folder_view_'+f.trim()).attr('class', 'bi bi-folder-plus')
        $('#navigator_table_'+f+'_view').empty();
    }
}

function properties_show_view(db, tb){
    params = {
        'database' : db.trim(),
        'table' : tb.trim()
    }
    var db_tb = db.trim() + '.' + tb.trim();
    $.ajax({
            type : "POST",
            url : "/api/navigator/view/property_api/",
            data : params,
            success : function(res){
                var parent = document.querySelector('.Navi-DF-menu3 .bi-check-circle-fill');
                if(parent != null){
                    parent.classList.remove('bi-check-circle-fill');
                    parent.classList.add('bi-circle');
                }
                $('html').css("cursor","auto");
                document.getElementById("property_Progress_Loading").style.display = "none";
                $('#'+tb).attr('class', 'bi bi-check-circle-fill menu-list'+tb+' menu-icon');
                $('#pro_data').attr('class', 'btn-tableProperties fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white active');
                $('#pro_col').attr('class', 'btn-tableProperties fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white');
                    $('#pro_source').attr('style', 'display:none!important;');
                $('#pro_ddl').attr('class', 'btn-tableProperties DDL-btn fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white');
                $('#pro_index').attr('style', 'display:none!important;');
                $('#pro_uqk').attr('style', 'display:none!important;');
                $('#pro_fgk').attr('style', 'display:none!important;');
                    if ($('#pro_data').attr("style").includes('none')){
                        $('#pro_data').attr('style', 'border: 1px solid var(--bs-btn-border-color);');
                    };
                    if ($('#pro_col').attr("style").includes('none')){
                        $('#pro_col').attr('style', 'border: 1px solid var(--bs-btn-border-color);');
                    };
                    if ($('#pro_ddl').attr("style").includes('none')){
                        $('#pro_ddl').attr('style', 'border: 1px solid var(--bs-btn-border-color);');
                    };
                all_data = res;
                const fieldset = document.getElementById('nav_btn_fieldset');
                fieldset.disabled = false;
                if ($.fn.DataTable.isDataTable('#properties_Table')) {
                    $("#properties_Table").remove()
                    var str = "";
                    str += `<div id = "property_Progress_Loading" >`
                    str +=    `<img src="` + img.src + `">`
                    str += `</div>`
                    str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm">'
                    str += '<thead>'
                    str += `<tr class="table-dark" id='properties_columns'>`
                    str += `</tr>`
                    str += `</thead>`
                    str += `<tbody id="properties_data">`
                    str += `</tbody>`
                    str += '</table>'
                    $("#pro_view").html(str);
                };

                $('#properties_columns').empty()
                $('#properties_data').empty()

                if (res.data_column.length == 0){
                    var str = "";
                    str += '<th>No Data</th>'
                }else {
                    var str = "";
                    $.each(res.data_column, function(i){
                        str += `<th>` + res.data_column[i] + `</th>`
                    });
                }
                $('#properties_columns').append(str)

                if (res.data.length == 0){
                    var str = "";
                    str += `<tr><td>No Data</td></tr>`
                }else{
                    var str = "";
                    $.each(res.data, function(i){
                        str += `<tr>`
                            $.each(res.data[i], function(j){
                                str += `<td>` + res.data[i][j] + `</td>`
                            });
                        str += `</tr>`
                    });
                }
                setCookie('dbtable', String(db_tb), 1);
                $('#properties_data').append(str)
                
                handleRenderpropertiesTableData();
            },
            beforeSend: function() {
                $('html').css("cursor","wait");
                document.getElementById("property_Progress_Loading").style.display = "inline";
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){
                var Toast = Swal.mixin({
                toast: true,
                position: 'center-center',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'error',
                    title: "Failed to get table properties."
                })
            }
        });
}
    //인덱스
    function show_index(f, class_property){
        if ($(class_property).attr("class").includes('right-fill')){
            $.ajax({
                type : "POST",
                url : "/api/navigator/navi_index/",
                data :{
                    'db' : f
                },
                success : function(res){
                    $(class_property).attr('class', 'bi bi-caret-down-fill menu-list menu-icon');
                    $('#folder_index_'+f.trim()).attr('class', 'bi bi-folder-check')
                    document.getElementById("Nav_Progress_Loading").style.display = "none";
                    $('html').css("cursor","auto");
                    $('#navigator_table_'+f+'_index').empty()
                    var str = "";
                    if (res.data.length == 0 ){
                        str += `<span style="padding-left:14px;">No data</span>`
                    }else{
                        $.each(res.data, function(i){
                            str += `<i id = "`+res.data[i][0].trim().replace(".", "and")+`"; class="bi bi-circle menu-list`+res.data[i][0].trim().replace(".", "and")+` menu-icon " 
                            ondblclick="properties_show_index('`+String(f) +`','`+ String(res.data[i][0].trim().replace(".", "and")) + `');"
                            style="padding-left:14px;"`
                            if (res.data[i][0].trim().length >= 20){
                                str +=  `onmouseover="text_box_over(event, 'index_box_on`+ res.data[i][0].trim().replace(".", "_") +`')" onMouseOut="table_box_down('index_box_on`+ res.data[i][0].trim().replace(".", "_") +`')">`
                                str += `&nbsp;` + res.data[i][0].trim().substr(0, 20) + "..." + ''
                                str += `<div class="jb-text" id="index_box_on`+res.data[i][0].trim().replace(".", "_")+`">`+ res.data[i][0].trim() +`</div>`
                            }else{
                                str += `>`
                                str += `&nbsp;`+  String(res.data[i][0]).trim() +``
                            }
                            str += `</i></br>`
                        });
                    }

                    $('#navigator_table_'+f+'_index').append(str)

                    
                },beforeSend :function(){
                    $('html').css("cursor","wait");
                    document.getElementById("Nav_Progress_Loading").style.display = "inline";
                }
            });
        }else {
            $(class_property).attr('class', 'bi bi-caret-right-fill menu-list menu-icon ');
            $('#folder_index_'+f).attr('class', 'bi bi-folder-plus')
            $('#navigator_table_'+f+'_index').empty();
        }
    }

    function properties_show_index(db, tb){
        params = {
            'database' : db.trim(),
            'table' : tb.trim(),
}
        var db_tb = db.trim()+ '.' + tb.trim();
        $.ajax({
                type : "POST",
                url : "/api/navigator/navi_index/property_api/",
                data : params,
                success : function(res){
                    var parent = document.querySelector('.Navi-DF-menu3 .bi-check-circle-fill');
                    if(parent != null){
                        parent.classList.remove('bi-check-circle-fill');
                        parent.classList.add('bi-circle');
                    }
                    $('html').css("cursor","auto");
                    document.getElementById("property_Progress_Loading").style.display = "none";
                    $('#'+tb).attr('class', 'bi bi-check-circle-fill menu-list '+tb+' menu-icon');
                    $('#pro_data').attr('style', 'display:none!important;');
                    $('#pro_col').attr('class', 'btn-tableProperties fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white active ');
                    $('#pro_source').attr('style', 'display:none!important;');
                    $('#pro_ddl').attr('style', 'display:none!important;');
                    $('#pro_index').attr('style', 'display:none!important;');
                    $('#pro_uqk').attr('style', 'display:none!important;');
                    $('#pro_fgk').attr('style', 'display:none!important;');
                    all_data = res;
                    const fieldset = document.getElementById('nav_btn_fieldset');
                    fieldset.disabled = false;
                    if ($.fn.DataTable.isDataTable('#properties_Table')) {
                        $("#properties_Table").remove()
                        var str = "";
                        str += `<div id = "property_Progress_Loading" >`
                        str +=    `<img src="` + img.src + `">`
                        str += `</div>`
                        str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm">'
                        str += '<thead>'
                        str += `<tr class="table-dark" id='properties_columns'>`
                        str += `</tr>`
                        str += `</thead>`
                        str += `<tbody id="properties_data">`
                        str += `</tbody>`
                        str += '</table>'
                        $("#pro_view").html(str);
                    };

                    $('#properties_columns').empty()
                    $('#properties_data').empty()
                    
                    if (res.column_column.length == 0){
                        var str = "";
                        str += '<th>No Data</th>'
                    }else {
                        var str = "";
                        $.each(res.column_column, function(i){
                            str += `<th>` + res.column_column[i] + `</th>`
                        });
                    }
                    $('#properties_columns').append(str)

                    if (res.columns.length == 0){
                        var str = "";
                        str += `<tr><td>No Data</td></tr>`
                    }else{
                        var str = "";
                        $.each(res.columns, function(i){
                            str += `<tr>`
                                $.each(res.columns[i], function(j){
                                    if(j == res.column_column.indexOf('Nullable')){
                                        if(res.columns[i][res.column_column.indexOf('Nullable')].trim() == 'N'){
                                            str += `<th>[V]</th>`
                                        }else{
                                            str += `<th>[ ]</th>`
                                        }
                                    }else{
                                        str += `<td>` + res.columns[i][j] + `</td>`
                                    }
                                });
                            str += `</tr>`
                        });
                    }
                    setCookie('dbtable', String(db_tb), 1);
                    $('#properties_data').append(str)
                    
                    handleRenderpropertiesTableData();
                },
                beforeSend: function() {
                    $('html').css("cursor","wait");
                    document.getElementById("property_Progress_Loading").style.display = "inline";
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    var Toast = Swal.mixin({
                    toast: true,
                    position: 'center-center',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'error',
                        title: "Failed to get table properties."
                    })
                }
            });
    }
    
    //procedure
    function show_pro(f, class_property){
        if ($(class_property).attr("class").includes('right-fill')){

            $.ajax({
                type : "POST",
                url : "/api/navigator/navi_procedure/",
                data :{
                    'database' : f
                },
                
                success : function(res){
                    $(class_property).attr('class', 'bi bi-caret-down-fill menu-list menu-icon');
                    $('#folder_pro_'+f.trim()).attr('class', 'bi bi-folder-check')
                    document.getElementById("Nav_Progress_Loading").style.display = "none";
                    $('html').css("cursor","auto");
                    $('#navigator_table_'+f+'_pro').empty()
                    var str = "";
                    if (res.data.length == 0 ){
                        str += `<span style="padding-left:14px;">No data</span>`
                    }else{
                        $.each(res.data, function(i){
                            str += `<i id = "`+res.data[i][0].trim()+`"; class="bi bi-circle menu-list`+res.data[i][0].trim()+` menu-icon " 
                            ondblclick="properties_show_pro('`+String(f) +`','`+ String(res.data[i][0].trim()) + `');"
                            style="padding-left:14px;"`
                            if (res.data[i][0].trim().length >= text_size){
                                str +=  `onmouseover="text_box_over(event, 'pro_box_on`+ res.data[i][0].trim() +`')" onMouseOut="table_box_down('pro_box_on`+ res.data[i][0].trim() +`')">`
                                str += `&nbsp;` + res.data[i][0].trim().substr(0, text_size) + "..." + ''
                                str += `<div class="jb-text" id="pro_box_on`+res.data[i][0].trim()+`">`+ res.data[i][0].trim() +`</div>`
                            }else{
                                str += `>`
                                str += `&nbsp;`+  String(res.data[i]).trim() +``
                            }
                            str += `</i></br>`
                        });
                    }
                    
                    $('#navigator_table_'+f+'_pro').append(str)

                    
                },beforeSend :function(){
                    $('html').css("cursor","wait");
                    document.getElementById("Nav_Progress_Loading").style.display = "inline";
                }
            });
        }else {
            $(class_property).attr('class', 'bi bi-caret-right-fill menu-list menu-icon ');
            $('#folder_pro_'+f).attr('class', 'bi bi-folder-plus')
            $('#navigator_table_'+f+'_pro').empty();
        }
    }

    function properties_show_pro(db, tb){
        params = {
            'database' : db.trim(),
            'table' : tb.trim(),
        }
        var db_tb = db.trim()+ '.' + tb.trim();
        $.ajax({
                type : "POST",
                url : "/api/navigator/navi_procedure/property_api/",
                data : params,
                success : function(res){
                    var parent = document.querySelector('.Navi-DF-menu3 .bi-check-circle-fill');
                    if(parent != null){
                        parent.classList.remove('bi-check-circle-fill');
                        parent.classList.add('bi-circle');
                    }
                    $('html').css("cursor","auto");
                    document.getElementById("property_Progress_Loading").style.display = "none";
                    $('#'+tb).attr('class', 'bi bi-check-circle-fill menu-list '+tb+' menu-icon');
                    $('#pro_data').attr('style', 'display:none!important;');
                    $('#pro_col').attr('class', 'btn-tableProperties fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white active ');
                    $('#pro_source').attr('class', 'btn-tableProperties fs-12px w-100px btn btn-outline-naviDF d-block mb-1 h-30px p-0 text-white ');
                    $('#pro_ddl').attr('style', 'display:none!important;');
                    $('#pro_index').attr('style', 'display:none!important;');
                    $('#pro_uqk').attr('style', 'display:none!important;');
                    $('#pro_fgk').attr('style', 'display:none!important;');
                    if ($('#pro_source').attr("style").includes('none')){
                        $('#pro_source').attr('style', 'border: 1px solid var(--bs-btn-border-color);');
                    };
                    all_data = res;
                    const fieldset = document.getElementById('nav_btn_fieldset');
                    fieldset.disabled = false;
                    if ($.fn.DataTable.isDataTable('#properties_Table')) {
                        $("#properties_Table").remove()
                        var str = " ";
                        str += `<div id = "property_Progress_Loading" >`
                        str +=    `<img src="` + img.src + `">`
                        str += `</div>`
                        str += '<table id="properties_Table" class="table TableProperties table-bordered dataFabricTable-sm">'
                        str += '<thead>'
                        str += `<tr class="table-dark" id='properties_columns'>`
                        str += `</tr>`
                        str += `</thead>`
                        str += `<tbody id="properties_data">`
                        str += `</tbody>`
                        str += '</table>'
                        $("#pro_view").html(str);
                    };

                    $('#properties_columns').empty()
                    $('#properties_data').empty()
                    if (res.columns_column.length == 0){
                        var str = "";
                        str += '<th>No Data</th>'
                    }else {
                        var str = "";
                        $.each(res.columns_column, function(i){
                            str += `<th>` + res.columns_column[i] + `</th>`
                        });
                    }
                    $('#properties_columns').append(str)
                    if (res.columns.length == 0){
                        var str = "";
                        str += `<tr><td>No Data</td></tr>`
                    }else{
                        var str = "";
                        $.each(res.columns, function(i){
                            str += `<tr>`
                                $.each(res.columns[i], function(j){
                                    str += `<td>` + res.columns[i][j] + `</td>`
                                });
                            str += `</tr>`
                        });
                    }
                    setCookie('dbtable', String(db_tb), 1);
                    $('#properties_data').append(str)
                    
                    handleRenderpropertiesTableData();
                },
                beforeSend: function() {
                    $('html').css("cursor","wait");
                    document.getElementById("property_Progress_Loading").style.display = "inline";
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    var Toast = Swal.mixin({
                    toast: true,
                    position: 'center-center',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'error',
                        title: "Failed to get table properties."
                    })
                }
            });
}
