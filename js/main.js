var board //結果確認用
var boardLength//ビンゴの大きさ

$(document).ready(function(){//コンストラクタ

    boardLength=7;//ビンゴの長さ

    board=Array();
    
    generateTable();//テーブルのセル生成
    generateRandomNumber1();//テーブルに初期データを入れる

    $("#reGenerate01btn").on('click',function()//ボタンにイベント実装
    {
        generateRandomNumber1();
    });

    $("#bingoTable").on('click','td',function(){
        clickCell($(this));
    });

    $('.close').on('click',function(){
        $('#myModal').hide();
        $('#NoNumber').hide();

    });

    $("#researchNumberBtn").on('click',function()//ボタンにイベント実装
    {
        searchNumber();
    });
});

function generateRandomNumber1()//数字生成
{
    //let numbers=Array.from({length: 105}, (_, i) => i + 1);  
    const numbers=[];
    for (let i = 1; i <= 105; i += 15) {
        const subArray = [];
        for (let j = i; j < i + 15 && j <= 105; j++) {
            subArray.push(j);
        }
        numbers.push(shuffle(subArray));
    }
    //generateCard(numbers);//カード作成
    
    generateCard(numbers);
}

function shuffle(array)
{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateCard(numbers)//カード作成
{
    // シャッフル
    //for (let i = numbers.length - 1; i > 0; i--) {
        //const j = Math.floor(Math.random() * (i + 1));
        //[numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    //}

    // 7x7の2次元配列に挿入
    const array = [];
    for (let i = 0; i < numbers.length; i++) 
    {
        const subArray = numbers[i].slice(0, 7);
        array.push(subArray);
    }

    const table = document.getElementById('bingoTable');

    for(let i=0;i<boardLength;i++)//数字をテーブルに入れる
    {
        board[i] = new Array(boardLength).fill(0);//盤面確認用の配列の生成

        for(let j=0;j<boardLength;j++)//ビンゴテーブルにデータを入れる
        {
            if(i==Math.floor(boardLength/2)&&j==Math.floor(boardLength/2))
            {
                table.rows[i].cells[j].innerHTML="FRE";
            }
            else
            {
                table.rows[i].cells[j].innerHTML=array[i][j];
            }
            table.rows[i].cells[j].style.backgroundColor  = "white";
            table.rows[i].cells[j].classList.add("cellClass");
        }
    }

    board[Math.floor(boardLength/2)][Math.floor(boardLength/2)]=1;//真ん中のfreeだけ1
    table.rows[3].cells[3].style.backgroundColor  = "yellow";
}

function generateTable()//テーブル生成
{
    const table = document.getElementById('bingoTable');
    table.innerHTML = ''; // テーブルをクリア

    for(let i=0;i<boardLength;i++)
    {
        let row= table.insertRow(i);
        for(let j=0;j<boardLength;j++)
        {
            let cell = row.insertCell(j);
            cell.classList.add('cellClass');
        }
    }
}

function clickCell($cell)
{
    //クリックしたcellの情報
    const $row = $cell.parent();
    const rowIndex = $row.index();
    const colIndex = $cell.index();


    // 背景色を変更
    if(board[rowIndex][colIndex]==0)
    {
        $cell.css('background-color', 'yellow');
        board[rowIndex][colIndex]=1;
    }
    else
    {
        $cell.css('background-color', 'white');
        board[rowIndex][colIndex]=0;
    }

    //result
    if(judgeResult()==true){
        $('#myModal').show();
    }


}

function searchNumber()//数字検索
{
    const table = document.getElementById('bingoTable');
    const number=$('#textbox').val();
    for (let row of table.rows) {
        for (let cell of row.cells) {
            if (cell.textContent == number) {
                cell.style.color = 'red'; // 直接色を変更
                return;
            }
        }
    }
    $('#NoNumber').show();

    //見つからなかったら
    //無いとポップアップを表示する


}

function judgeResult()//ビンゴが揃ったか確認
{
    let count=0;

    //よこ
    for(let i=0;i<boardLength;i++)//数字をテーブルに入れる
    {
        for(let j=0;j<boardLength;j++)
        {
            count=count+board[i][j];
        }
        if(count==7)
        {
            return true;
        }
        count=0;
    }

    //たて
    for(let i=0;i<boardLength;i++)//数字をテーブルに入れる
    {
        for(let j=0;j<boardLength;j++)
        {
            count+=board[j][i];
        }
        if(count==7)
        {
            return true;
        }
        count=0;
    }
    //ななめ1
    for(let i=0;i<boardLength;i++)//数字をテーブルに入れる
    {
        count+=board[i][i];    
    }
    if(count==7)
    {
        return true;
    }

    count=0;

    //ななめ2
    for(let i=boardLength-1;i>=0;i--)//数字をテーブルに入れる
    {
        count+=board[boardLength-1-i][i];   
    }
    if(count==7)
    {
        return true;
    }

    return false;

}