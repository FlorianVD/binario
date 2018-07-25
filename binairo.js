$(document).ready(function(){
    var grid = [[null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null]];

    $('.btnOplossen').click(function(){
        $('.row').each(function(i){
            $('.row.' + i).children().each(function(j, val){
            
            let value = $(val).val();
            grid[i][j] = value;
            });
        });

        solver = new Solver(grid, $('#cols').val(),$('#rows').val());

        solver.solve();
        
        show(solver.game);
    });

    $('#btnGen').click(function(){
        let rows = $('#rows').val();
        let cols = $('#cols').val();

        grid = [];
        for(let i = 0; i < rows; i++){
            grid.push([]);
            for(let j = 0; j < cols; j++){
                grid[i].push(null);
            }
        }

        let html = "";
        for(let i = 0; i < rows; i++){
            html += '<div class="row '+i+'" >'
            for(let j = 0; j < cols; j++){
                html += '<input type="text" name="" id="" class="col">';
            }
            html += "</div>";
        }


        $('.grid').html(html);
    });

    function show(field){
        $('.row').each(function(i){
            $('.row.' + i).children().each(function(j, val){
                let element = $(val);
                
                if(element.val() == ""){
                    element.val(field[i][j]);
                    element.addClass('red');
                }
            });
        });
    }

});

class Solver{

    constructor(field, cols, rows){
        this.columnns = (cols === "")? 6 : cols;
        this.rows = (rows === "")? 6 : rows;
        this.game = field;
        this.copy = [];
        this.i = 0;
        this.solved = false;

        this.setCopyNulls();
    }

    setCopyNulls(){
        for(let i = 0; i < this.rows; i++){
            this.copy.push([]);
            for(let j = 0; j < this.columnns; j++){
                this.copy[i].push(null);
            }
        }
    }

    solve(){
        if(this.i > 100){
            alert("Ik ben nog niet slim genoeg. Fix me!");
            console.log("Game grid");
            console.table(this.game);
            console.log("Game copy");
            console.table(this.copy);
            return;
        }
        this.solveGame();
        console.log("Na solveSimple");
        console.table(this.game);
        //this.createGameCopy();
        this.isValid();
        if(!this.solved){
            //console.table(this.game);
            if(this.isValid()){
                console.log("Valid");
    
                this.createGameCopy();
                //console.table(this.copy);
    
                if(!this.solved){
                    //this.createGameCopy();
                    this.i++;
                    if(this.isValid()){
                        this.makeGuess("0");
    
                        //rerun current method
                        this.solve();
                    }
                    else{
                        console.log(`Niet gelukt, ik stop hier. ${i} keren geprobeerd`);
                    }
                }
                else{
                    return true;
                }
            }
            else{
                this.i++;
                console.log("Niet geldig, opnieuw proberen");
                this.revertGameGrid();
                this.makeGuess("1");
                this.solve();
            }
        }
        else{
            console.log("Klaar!");
            return true;
        }

        // do{
        //     this.solveGame();

        //     i++;
        //     if(i > 100){
        //         break;
        //     }
        // }
        // while(!this.solved)
    }

    isValid(){
        let onesCount;
        let zerosCount;

        let isValid = true;

        //check aantal in rij
        for(let i = 0; i < this.rows; i++){
            onesCount = 0;
            zerosCount = 0;

            for(let j = 0; j < this.columnns; j++){
                if(this.game[i][j] === "0")
                    zerosCount++;
                else if(this.game[i][j] === "1")
                    onesCount++;
            }

            
            if(zerosCount > this.columnns / 2 || onesCount > this.columnns / 2){
                console.log(`Rij ${i}`);
                isValid = false;

                console.log("Te veel per rij");
            }
        }

        //check aantal in kolom
        for(let i = 0; i < this.columnns; i++){
            onesCount = 0;
            zerosCount = 0;

            for(let j = 0; j < this.rows; j++){
                if(this.game[j][i] === "0")
                    zerosCount++;
                else if(this.game[j][i] === "1")
                    onesCount++;
            }

            
            if(zerosCount > this.rows / 2 || onesCount > this.rows / 2){
                console.log(`Kolom ${i}`);
                isValid = false;
                console.log("Te veel per kolom");
            }
        }

        //check meer dan 2 na elkaar in rij
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columnns - 2; j++){
                if(this.game[i][j] === this.game[i][j+1] && this.game[i][j] != ""){
                   if(this.game[i][j + 1] === this.game[i][j + 2]){
                       isValid = false;
                       console.log(`Meer dan 2 per rij, rij: ${i}`);
                   }
                }
            }
        }

        //check meer dan 2 na elkaar in kolom
        for(let i = 0; i < this.columnns; i++){
            for(let j = 0; j < this.rows - 2; j++){
                if(this.game[j][i] === this.game[j + 1][i] && this.game[j][i] != ""){
                   if(this.game[j + 1][i] === this.game[j + 2][i]){
                       isValid = false;
                       console.log(`Meer dan 2 per kolom, kolom: ${j}`);
                   }
                }
            }
        }

        //check zelfde rijen
        let seen = {};
        this.game.map(function(val, i){
            if(seen.hasOwnProperty(val)){
                isValid = false;
                console.log("Dubbele rij");
                //console.log(seen);
                //console.info(`Index ${i}, dubbele rij`);
            }
            else{
                seen[val] = i;
            }
        });

        //check zelfde kolommen
        seen = {};
        let test = this.game.slice();
        test.reverse().map(function(val, i){
            if(seen.hasOwnProperty(val)){
                isValid = false;
                console.log("Dubbele kolom");
            }
            else{
                seen[val] = i;
            }
        });
        

        // columns.map(function(val, i){
        //     if(seen.hasOwnProperty(val)){
        //         console.log(seen);
        //         isValid = false;
        //     }
        //     else{
        //         seen[val] = i;
        //     }
        // });

        //check lege velden

        console.table(this.game);
        if(isValid){
            if(this.searchEmptyCell() == null){
                this.solved = true;
            }
        }

        return isValid;
    }

    createGameCopy(){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columnns; j++){
                this.copy[i][j] = this.game[i][j];
            }
        }

        console.log("Created copy");
        //console.table(this.copy);
    }

    revertGameGrid(){
        console.log("Reverting game");
        console.table(this.copy);
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columnns; j++){
                this.game[i][j] = this.copy[i][j];
            }
        }

        console.log("Revert game grid");
        let test = this.game.slice();
        //console.table(test);
    }

    makeGuess(value){
        let pair = this.searchEmptyCell();
        
        console.log(`Guessing op x: ${pair.x} en y: ${pair.y}`);
        this.game[pair.x][pair.y] = value;
    }

    solveGame(){
        this.solveDubbelsHorizontal();
        this.solveSplitsHorizontal();
        this.solveDubbelsVertical();
        this.solveSplitsVertical();
        this.solveByCountHorizontal();
        this.solveByCountVertical();
    }

    notSolved(){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columnns; j++){
                if(this.game[i][j] === ""){
                    return true;
                }
            }
        }

        return false;
    }

    solveDubbelsHorizontal(){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columnns - 1; j++){
                if(this.game[i][j] === this.game[i][j+1] && this.game[i][j] != ""){
                    if(j === 0){
                        this.checkAchter(i, j);
                    }
                    else if(i == this.columnns - 2){
                        this.checkVoor(i, j);
                    }
                    else{
                        this.checkAchter(i,j);
                        this.checkVoor(i, j);
                    }
                }
            }
        }
    }

    solveDubbelsVertical(){
        for(let i = 0; i < this.columnns; i++){
            for(let j = 0; j < this.rows - 1; j++){
                if(this.game[j][i] === this.game[j + 1][i] && this.game[j][i] != ""){
                    if(j == 0){
                        this.checkOnder(j, i);
                    }
                    else if(j === this.rows - 2){
                        this.checkBoven(j,i);
                    }
                    else{
                        this.checkOnder(j,i);
                        this.checkBoven(j,i);
                    }
                }
            }
        }
    }

    solveSplitsHorizontal(){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columnns - 2; j++){
                if(this.game[i][j] == this.game[i][j+2] && this.game[i][j] != ""){
                    this.checkTussenHorizontaal(i,j);
                }
            }
        }
    }

    solveSplitsVertical(){
        for(let i = 0; i < this.rows - 2; i++){
            for(let j = 0; j < this.columnns; j++){
                if(this.game[i][j] == this.game[i + 2][j] && this.game[i][j] != ""){
                    this.checkTussenVerticaal(i,j);
                }
            }
        }
    }

    solveByCountHorizontal(){
        let zerosCount;
        let onesCount;

        for(let i = 0; i < this.rows; i++){

            zerosCount = 0;
            onesCount = 0;
            
            for(let j = 0; j < this.columnns; j++){
                if(this.game[i][j] === "0")
                    zerosCount++;
                else if(this.game[i][j] === "1")
                    onesCount++;
            }
            //console.log(`Rij ${i} heeft ${zerosCount} nullen en ${onesCount} 1tjes`);
            if(zerosCount == this.columnns / 2){
                this.fillWithOnesHorizontal(i);
            }
            else if(onesCount == this.columnns / 2){
                this.fillWithZerosHorizontal(i);
            }
        }
    }

    solveByCountVertical(){
        let zerosCount;
        let onesCount;

        for(let i = 0; i < this.columnns; i++){
            
            zerosCount = 0;
            onesCount = 0;
            
            for(let j = 0; j < this.rows; j++){
                if(this.game[j][i] === "0")
                    zerosCount++;
                else if(this.game[j][i] === "1")
                    onesCount++;
            }

            if(zerosCount == this.rows / 2){
                this.fillWithOnesVertical(i);
            }
            else if(onesCount == this.rows / 2){
                this.fillWithZerosVertical(i);
            }
        }
    }

    fillWithZerosHorizontal(row){
        for(let i = 0; i < this.columnns; i++){
            if(this.game[row][i] === ""){
                this.game[row][i] = "0";
            }
        }
    }

    fillWithOnesHorizontal(row){
        for(let i = 0; i < this.columnns; i++){
            if(this.game[row][i] === ""){
                this.game[row][i] = "1";
            }
        }
    }

    fillWithZerosVertical(column){
        for(let i = 0; i < this.rows; i++){
            if(this.game[i][column] === ""){
                this.game[i][column] = "0";
            }
        }
    }

    fillWithOnesVertical(column){
        for(let i = 0; i < this.rows; i++){
            if(this.game[i][column] === ""){
                this.game[i][column] = "1";
            }
        }
    }

    checkVoor(x, y){
        if(this.game[x][y - 1] === ""){
            this.game[x][y-1] = this.setValue(this.game[x][y]);
        }
    }

    checkAchter(x, y){
        if(this.game[x][y+2] === ""){
            this.game[x][y+2] = this.setValue(this.game[x][y]);
        }
    }

    checkBoven(x, y){
        if(this.game[x - 1][y] === ""){
            this.game[x - 1][y] = this.setValue(this.game[x][y]);
        }
    }

    checkOnder(x, y){
        if(this.game[x + 2][y] === ""){
            this.game[x + 2][y] = this.setValue(this.game[x][y]);
        }
    }

    checkTussenHorizontaal(x,y){
        if(this.game[x][y + 1] === ""){
            this.game[x][y+1] = this.setValue(this.game[x][y]);
        }
    }

    checkTussenVerticaal(x, y){
        if(this.game[x + 1][y] === ""){
            this.game[x + 1][y] = this.setValue(this.game[x][y]);
        }
    }

    setValue(val){
        return (val === "0") ? "1" : "0";
    }

    searchEmptyCell(){
        let pair = null;
        let valid = false;

        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columnns; j++){
                if(this.game[i][j] === ""){
                    pair = {
                        "x": i,
                        "y": j
                    }

                    break;
                }
            }
        }
        
        return pair;
    }
}