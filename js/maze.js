'use strict';

(() => {

    //迷路の基本描画（Mazeクラスの引数に入れて使う／canvasサイズ設定、壁の塗りつぶし）
    class MazeRenderer {
        constructor(canvas) {
            this.ctx = canvas.getContext('2d');
            this.WALL_SIZE = 10;
        }

        render(data) {
            canvas.height = data.length * this.WALL_SIZE;
            canvas.width = data[0].length * this.WALL_SIZE;

            //壁(data[][]===1となっているマス)を黒く塗る
            for (let row = 0; row < data.length; row++) {
                for (let col = 0; col < data[0].length; col++) {
                    if (data[row][col] === 1) {
                        this.ctx.fillRect(
                            this.WALL_SIZE * col,
                            this.WALL_SIZE * row,
                            this.WALL_SIZE,
                            this.WALL_SIZE);
                    }
                }
            }
        }
    }



    class Maze {
        constructor(row, col, renderer) {
            if (row < 5 || col < 5 || row % 2 === 0 || col % 2 === 0) {
                alert("Size is not valid.\nSize must be 'over 5' and 'odd number'.");
                return;
            }

            this.renderer = renderer;
            this.row = row;
            this.col = col;

            //迷路のデータ。1が壁。0が通路。
            this.data = this.getData();
        }


        getData() {
            const data = [];

            //全てのマスを壁(1)に...(※1-1)
            for (let row = 0; row < this.row; row++) {
                data[row] = [];
                for (let col = 0; col < this.col; col++) {
                    data[row][col] = 1;
                }
            }
            //外周以外を通路(0)に...(※1-2)
            for (let row = 1; row < this.row - 1; row++) {
                for (let col = 1; col < this.col - 1; col++) {
                    data[row][col] = 0;
                }
            }
            //格子状に壁を用意...(※1-3-A)
            for (let row = 2; row < this.row - 2; row += 2) {
                for (let col = 2; col < this.col - 2; col += 2) {
                    data[row][col] = 1;
                }
            }
            //格子状に壁を用意...(※1-3)
            for (let row = 2; row < this.row - 2; row += 2) {
                for (let col = 2; col < this.col - 2; col += 2) {
                    let destRow;
                    let destCol;
                    //棒（壁）を上下左右いずれかに倒す
                    do {
                        const dir = row === 2 ?
                            Math.floor(Math.random() * 4) :      //row==2の場合は、0,1,2,3をランダムに選択
                            Math.floor(Math.random() * 3) + 1;  //row==2以外の場合は、1,2,3をランダムに選択
                        switch (dir) {
                            case 0: //up
                                destRow = row - 1;
                                destCol = col;
                                break;
                            case 1: //down
                                destRow = row + 1;
                                destCol = col;
                                break;
                            case 2: //left
                                destRow = row;
                                destCol = col - 1;
                                break;
                            case 3: //right
                                destRow = row;
                                destCol = col + 1;
                                break;
                        }
                        //棒の倒れた先（switch文での選択先）がすでに壁の場合は、もう一度処理して他のマスを壁にしたい  
                    } while (data[destRow][destCol] === 1) //data[destRow][destCol]が壁の場合、もう一度do文処理

                    //選択されたマスを壁(1)に
                    data[destRow][destCol] = 1;
                }
            }
            return data;
        };

        //MazeRendererクラスで記述
        render() {
            this.renderer.render(this.data);
        };


    }

    
    const canvas = document.querySelector('canvas');
    if (typeof canvas.getContext === 'undefined') {
        return;
    }

    const maze = new Maze(21, 15, new MazeRenderer(canvas));
    maze.render();

    console.log(maze.data);

})();

//※1 棒倒し法...迷路のアルゴリズム
//"./棒倒し法の解説.png"を参照

//(1)2次元配列の作成（全てのパネルを壁に）(縦横それぞれマスの数は奇数である必要がある)
//(2)外周を壁にする（外周から１パネル内側をすべて通路に）
//(3)格子状に壁とみなす（(2)から１パネル内側を対象に、縦横1マスおきに壁にする）
//(4)１列目を上下左右ランダムに倒す
//(5)２列目以降を上以外の３方にランダムに倒す