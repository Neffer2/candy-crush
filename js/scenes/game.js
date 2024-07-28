const CANDY_NAMES = ['candy1', 'candy2', 'candy3', 'candy4', 'candy5'];

// POSITIONS
const CANDY_SPACING = 175;

let candies = [];
let candy;
let allowMove = true;

let mContext;

export class Game extends Phaser.Scene {
    constructor ()
    {
        super('Game');
    }
    
    init() {
        let spacing_x = 100;
        let spacing_y = 100;
        let candy_count = 0;
        while (candy_count < 20){
            candy = this.physics.add.sprite(spacing_x, spacing_y, CANDY_NAMES[this.getRandomInt(CANDY_NAMES.length)]).setScale(.28);
            candy.name = candy_count;
            candies.push(candy);

            spacing_x += CANDY_SPACING;
            candy_count++;
            
            if (candy_count != 0 && candy_count % 4 === 0){
                spacing_y+= CANDY_SPACING;
                spacing_x = 100;
            }
        }
    }

    create (){
        mContext = this;
        let dragCandy, dragoverCandy;
        candies.forEach((candy) => {
            candy.setInteractive({ draggable: true , dropZone: true });
            candy.on('drag', function(pointer, localX, localY){
                dragCandy = candy;
            }, mContext);

            candy.on('dragover', function(pointer, gameObject){
                if (dragCandy !== gameObject){
                    if (allowMove){
                        console.log('move');
                        this.candyMove(dragCandy, gameObject);

                        allowMove = !allowMove;
                        setTimeout(() => {
                            allowMove = !allowMove;
                        }, 1000);
                    }
                }
            }, mContext);
        });
    } 

    update(){
        
    }

    getRandomInt(max){
        return Math.floor(Math.random() * max);
    }

    candyMove(moved, target){
        let movedX = moved.x;        
        let movedY = moved.y;

        let targetX = target.x;

        let movedXInterval = setInterval(() => {
            moved.x += 3; 
            if (Math.floor(moved.x) >= targetX || moved.x > 720)  {
                clearInterval(movedXInterval);
                moved.x = targetX;
            }
        }, 4);

        let targetXInterval = setInterval(() => {
            target.x -= 3; 
            if (Math.floor(target.x) <= movedX || target.x < 0)  {
                clearInterval(targetXInterval);
                target.x = movedX;
            }
        }, 4);
    }
}
