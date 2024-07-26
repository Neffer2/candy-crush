const CANDY_NAMES = ['candy1', 'candy2', 'candy3', 'candy4', 'candy5'];

// POSITIONS
const CANDY_SPACING = 175;

let candies = [];
let candy;
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
                console.log(candy_count);
            }
        }
    }

    create (){
        mContext = this;
        candies.forEach(($candy) => {
            $candy.setInteractive({ draggable: true , dropZone: true });
            $candy.on('drag', function(pointer, localX, localY){
                console.log('drag', $candy.name);
            }, mContext);

            $candy.on('dragover', function(pointer, gameObject){
                console.log('draover', gameObject.name);
            }, mContext);
        });
    } 

    update(){
        
    }

    getRandomInt(max){
        return Math.floor(Math.random() * max);
    }

    candyMoveX($moved, $target){
        console.log($moved, $target);
    }
}
