$(document).ready(function(){

    var grid = [[null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null]];

    console.table(grid);

    $('.btnOplossen').click(function(){
        $('.row').each(function(i){
            //console.log("Row: " + i);
            $('.row.' + i).children().each(function(j, val){
                // if(j > 5)
                //     return true;
            //console.log($(val).val());
            let value = $(val).val();
            grid[i][j] = value;
            //console.log("Row: " + i + " Column: " + j + " Value: " + $(val).val());
            });
        });

        var original = grid;
        console.info("Original");
        console.table(original);

        grid = solve(grid);
        console.info('First try');        
        console.table(grid);

        i = 1;
        while(!solved()){
            console.log(`loop ${i}`)
            console.table(grid);
            grid = solve(grid);
            console.table(grid);
            
            grid = fill_rows(grid);
            //grid = solve(grid);
            grid = fill_cols(grid);
            
            if(i > 5){
                console.table(grid);
                console.log(grid);
                break;
            }
            i++;
        }

        show();

    });


    function solved(){
        for(let i = 0; i < 6; i++){
            for(let j = 0; j < 6; j++){
                if(grid[i][j] == "")
                    return false;
            }
        }

        return true;
    }

    function show(){
        $('.row').each(function(i){
            //console.log("Row: " + i);
            $('.row.' + i).children().each(function(j, val){
                // if(j > 5)
                //     return true;
            //console.log($(val).val());
            let element = $(val);
            if(element.val() != ""){
                return true;
            }
            else{
                element.val(grid[i][j]);
                element.addClass("red");
            }
            //console.log("Row: " + i + " Column: " + j + " Value: " + $(val).val());
            });
        });
    }

    function solve(field){
        for(let i = 0; i < 6; i++){
            for(let j = 0; j < 6; j++){
                let current = field[i][j];
                let opposit = (current == "0")? "1" : "0";

                if(current !== ""){
                    if(border(j)){
                        if(field[i][j - 1] == current){
                            field[i][j-2] = opposit;
                        }
                        if(field[i][j - 1 ] == "" && field[i][j-2] == current){
                            field[i][j-1] = opposit;
                            //console.log("ja");
                        }
                    }
                    if(j < 4){
                        if(field[i][j + 1] == current){
                            field[i][j + 2] = opposit;
                        }
                        if(field[i][j + 1 ] == "" && field[i][j+2] == current){
                            field[i][j+1] = opposit;
                        }
                    }
                    if(border(i)){
                        if(field[i - 1][j] == current){
                            field[i-2][j] = opposit;
                        }
                        if(field[i - 1][j] == "" && field[i-2][j]== current){
                            field[i - 1][j] = opposit;
                        }
                    }
                    if(i < 4){
                        if(field[i + 1][j] == current){
                            field[i+2][j] = opposit;
                        }
                        if(field[i + 1][j] == "" && field[i+2][j]== current){
                            field[i + 1][j] = opposit;
                        }
                    }
                }
            }    
        }
        return field;
    };

    function fill_cols(field){
        col = [];
        for(let i = 0; i < 6; i++){
            col = field[i];
            
            let nulls = 0;
            let ones = 0;
            $.map(col, function(val, i){
                if(val === "0")
                    nulls++;
                else if(val == "1")
                    ones++;
            })

            if(nulls != ones){
                if(nulls < ones){
                    $.map(col, function(val, i){
                        if(val == "")
                            col[i] = "0";
                    });
                }
                else if (nulls > ones){
                    $.map(col, function(val, i){
                        if(val == "")
                            col[i] = "1";
                    });
                }
                else{
                    return true;
                }
            }

            for(let i = 0; i < 6; i++){
                for(let j = 0; j < 6; j++){
                    if(field[i][j] === ""){
                        if(border(j)){
                            if(field[i][j-1] != col[j] && field[i][j+1] != col[j]){
                                field[i][j] = col[j];
                            }
                        }
                    }
                }
            }
        }

        col = [];
        return field;
    }

    function fill_rows(field){
        row = [];
        for(let j = 0; j < 6; j++){
            for(let i = 0; i < 6; i++){
                row.push(field[i][j]);
                
            }


            let nulls = 0;
            let ones = 0;
            $.map(row, function(val, i){
                if(val === "0")
                    nulls++;
                else if(val === "1")
                    ones++;
            });

            if(nulls != ones){
                if(nulls < ones){
                    $.map(row, function(val, i){
                        if(val == "")
                            row[i] = "0";
                    });
                }
                else if (nulls > ones){
                    $.map(row, function(val, i){
                        if(val == "")
                            row[i] = "1";
                    });
                }
                else{
                    return true;
                }
            }


            for(let j = 0; j < 6; j++){
                for(let i = 0; i < 6; i++){
                    if(field[i][j] == ""){
                        if(border(i)){
                            if(field[i][j - 1] != row[i] && field[i][j + 1] != row[i]){
                                field[i][j] = row[i];
                            }
                        }
                        else if(i < 1){
                            if(field[i][j + 1] != row[i]){
                                field[i][j] = row[i];
                            }
                        }
                    }
                }
            }
            row = [];
        }
        //console.table(field);
        return field;
    }

    function border(val){
        if(val > 1)
            return true;

        return false;
    }
});