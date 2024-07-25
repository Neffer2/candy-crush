const CANDY_NAMES = ['candy1', 'candy2', 'candy3', 'candy4', 'candy5'];

// POSITIONS
const CANDY_SPACING = 175;

let candies = [];
let candy;


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
            candy = this.add.sprite(spacing_x, spacing_y, CANDY_NAMES[this.getRandomInt(CANDY_NAMES.length)]).setScale(.28);
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
        
    } 

    update(){
        
    }

    getRandomInt(max){
        return Math.floor(Math.random() * max);
    }
}
