class Railway {
       constructor(train0,train1,train2){
        this.line0 = [new Train(train0), 0, 'junction', 0,'junction',0 ,0 ,0];
        this.line1 = [new Train(train1), 'junction', 'junction', 0, 0];
        this.line2 = [new Train(train2), 0, 'junction', 'junction', 0, 0];
    }

    railWayLinePriority(){
        let trains = [
            railWay.line0.filter(item => item.hasOwnProperty("numberOfPassengers"))[0],
            railWay.line1.filter(item => item.hasOwnProperty("numberOfPassengers"))[0],
            railWay.line2.filter(item => item.hasOwnProperty("numberOfPassengers"))[0]
        ];
        const trainsByPrecedence = trains.sort((a, b) => b.numberOfPassengers - a.numberOfPassengers); // Sorting precedence by train to move on rails. Lower array index denotes higher precedence
        return  trainsByPrecedence;
    }
    
    trainDirection(train, railWayLength, trainLocation) {
        if(train.direction === 1){ // direction left => right
            railWayLength === trainLocation + 1 ? train.direction = -1 : train.direction = 1
            return train.direction
        }
        if(train.direction === -1){ // direction right => left
            trainLocation === 0 ? train.direction = 1 : train.direction = -1
            return train.direction
        }
    }

    updateRailLine(line, trainsByPrecedence, i) {
        if (line.includes(trainsByPrecedence[i])) {
            let trainLocation = line.findIndex(train => train.hasOwnProperty('train'));
            let updatedLine = line.slice();
            let train = updatedLine[trainLocation];
           
            if (updatedLine[trainLocation + this.trainDirection(train, updatedLine.length, trainLocation)] === 0) { // Checking next node if it's free or a free-junction
                train.isOnJunction ? updatedLine[trainLocation] = 'junction' : updatedLine[trainLocation] = 0;
                train = Object.assign(train, {isOnJunction: false})
                updatedLine[trainLocation + this.trainDirection(train, updatedLine.length, trainLocation)] = train; // Move train to next node
                return updatedLine;
            } else if (updatedLine[trainLocation + this.trainDirection(train, updatedLine.length, trainLocation)] === 'junction') {
                train.isOnJunction ? updatedLine[trainLocation] = 'junction' : updatedLine[trainLocation] = 0;
                train = Object.assign(train, {isOnJunction: true});
                updatedLine[trainLocation + this.trainDirection(train, updatedLine.length, trainLocation)] = train;
                return updatedLine;
            } else return line;
            
        } else return line;
        
    }

    trainDeparting(){
        const trainsByPrecedence = this.railWayLinePriority();
        console.log(trainsByPrecedence.map(item=>item.train)) // Logging trains by precedence/priority   
            for(let i = 0; i < trainsByPrecedence.length; i++){
                this.line0 = this.updateRailLine(this.line0, trainsByPrecedence, i); 
                this.line1 = this.updateRailLine(this.line1, trainsByPrecedence, i); 
                this.line2 = this.updateRailLine(this.line2, trainsByPrecedence, i); 

                this.signalJunctions(this.line0, this.line1, 2, 1);
                this.signalJunctions(this.line0, this.line2, 4, 2); 
                this.signalJunctions(this.line1, this.line0, 1, 2);
                this.signalJunctions(this.line1, this.line2, 2, 3);
                this.signalJunctions(this.line2, this.line0, 2, 4);
                this.signalJunctions(this.line2, this.line1, 3, 2);
            } // for loop end
    }

    signalJunctions(activeLine, affectedLine,  nodeAtActive,  nodeAtAffected)  {
        if (activeLine[nodeAtActive].hasOwnProperty('train')) {
            affectedLine[nodeAtAffected] = 'passing train';
        }
        if (activeLine[nodeAtActive] === 'junction' && !affectedLine[nodeAtAffected].hasOwnProperty('train')) {
            affectedLine[nodeAtAffected] = 'junction';
        }
    }
  
} // class end

class Train {
    constructor(train) {
        this.train = train;
        this.isOnJunction = false;
        this.direction = 1;
        this.numberOfPassengers = Train.passengers(100);
    }

    static passengers(randomNum){
        return Math.floor(Math.random()*randomNum + 1);
    }
}

const railWay = new Railway('a', 'b', 'c');
const train0 = railWay.line0.findIndex(train => train.hasOwnProperty('train'));
const train1 = railWay.line1.findIndex(train => train.hasOwnProperty('train'));
const train2 = railWay.line2.findIndex(train => train.hasOwnProperty('train'));

railWay.railWayLinePriority(); // Sorting lines for precedence
railWay.trainDeparting(); // Trains moving -- Use this command to force trains move within their rails assuming junctions are free i.e. no other train is passing


