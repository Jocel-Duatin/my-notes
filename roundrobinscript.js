var numberofteams =7;

var numberofrefs = 6;

var removeslots = ['1 1']; //timeslot and court multiple

//1 1 = court B 5pm

var week =[0,1]; //certain chosen week



// ************* CREATE MATCHUPS **************** //

function shuffle(teams){

    for (let i = teams.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [teams[i], teams[j]] = [teams[j], teams[i]];

    }

}

function createTempRef(number){

    var ref = [];

    for(let i=0;i<number;i++){

        ref[i] = 'ref'+(i+1);

    }

    return ref;

}

function createTempTeams(number){

    var teams = [];

    for(let i=0;i<number;i++){

        teams[i] = 'team'+(i+1);

    }

    return teams;

}

function gameFormat(format,teams,refs){

    if(format == 'round-robin'){

        var tempteams = [];

        var lastarray = teams.length -1;

        var teamsperround= [];

        var tempmatchups = [];

        var matchups = [];

        var games = [];

        var concurrentgames = Math.floor(teams.length/2);

        var totalgames = teams.length *(teams.length - 1)/2;

    

        var rounds = totalgames/concurrentgames;

    

        // Set teams per round 

        for(let j =0;j < rounds; j++){ // rounds

            for (let i =0;i < teams.length; i++) { // teams

                if(teams.length %2 ==0){ // even teams

                    tempteams[i] = teams[i+1];

                    tempteams[lastarray] = teams[lastarray];

                    tempteams[lastarray-1] = teams[0];

                }

                else{ // odd teams

                    if(j == 0 ){

                        tempteams[i] = teams[i];

                    }

                    else{ 

                        if((i+1) > lastarray){

                            tempteams[i] = teams[(i)-lastarray]

                        }

                        else{

                            tempteams[i] = teams[i+1];}

                    }

                }

            }

            teams = tempteams;

            teamsperround[j] = teams;

            tempteams=[];

        }

        // Assign opposing teams

        var gamenum =1;

        var refindex=0;

        for(let j =0;j < rounds; j++){ 

            var lastindex = teams.length -1;

            var firstindex = 0;

            if(teams.length %2 !=0){

                firstindex = 1;

            }

            for (let i =0;i < teams.length; i++) { 

                if(i<concurrentgames){

                    if(refindex == refs.length){

                        refindex = 0;

                    }

                    tempmatchups [i] = {

                        teams:[teamsperround[j][firstindex],teamsperround[j][lastindex]],

                        // nextgame:0,

                        gamenumber:gamenum,

                        round:(j+1),

                        refs:refindex+1

                    };

                    games.push(tempmatchups[i]);

                    gamenum++;

                    firstindex++;

                    lastindex--;

                    refindex++;

                }

            }

            matchups[j]=tempmatchups;

            tempmatchups =[];  

        }

        return games;

    }

    else if(format == 'single-elimination'){

        var qualified_teams = teams.length;

        var groups = qualified_teams/2;

        var matchups = [];

        var games = [];

        let j = teams.length-1;

        //creat list of matchups including future games without winner

        var number_games = teams.length-1;

        var gamesequence = (qualified_teams/2);

        var future_matchups = [];

        var checksequence = 0;

        for(let i=0;i<qualified_teams-1;i++){

          if(checksequence %2 == 0){

               gamesequence++;

          } 

          if(i < groups){

              matchups[i] = {

                  teams:[teams[i],teams[j]],

                  nextgame:gamesequence,

                  gamenumber:i+1,

                  round:0

              };

              games.push(matchups[i].teams);

              j--;

          }

          else{

              if(i == (number_games-1)){

                  matchups[i] = {

                      teams:['tba','tba'],

                      nextgame:0,

                      gamenumber:i+1,

                      round:0,

                  };

                games.push(matchups[i].teams);

              }

              else{

                  matchups[i] = {

                      teams:['tba','tba'],

                      nextgame:gamesequence,

                      gamenumber:i+1,

                      round:0,

                  };

                games.push(matchups[i].teams);

              }

          }

          checksequence++;

        }

        return games;

    }

    else{// double-elimination



    }

}

function createMatchups(format){

    var teams =  this.createTempTeams(numberofteams);

    var refs =  this.createTempRef(numberofrefs);

    var games = this.gameFormat(format,teams,refs);



    return games;

}



// ************* CREATE SCHEDULE SLOTS **************** //

function getDaysBetweenDates(start, end, dayName) {

    var result = [];

    var days = {sun:0,mon:1,tue:2,wed:3,thu:4,fri:5,sat:6};

    var day = days[dayName.toLowerCase().substr(0,3)];

    // Copy start date

    var current = new Date(start);

    // Shift to next of required days

    current.setDate(current.getDate() + (day - current.getDay() + 7) % 7);

    // While less than end date, add dates to result array

    while (current < end) {

        result.push(new Date(+current).toDateString());

        current.setDate(current.getDate() + 7); 

    }

    return result;  

}

var format = 'round-robin';

var preferedDays = ['Mon','Tue'];

var courts = ['Court A','Court B'];

var timeslots = ['8am','5pm'];

var schedule = [];

var dayofWeek = [];

var matchups = this.createMatchups(format);



for(let i=0;i<preferedDays.length;i++){

    dayofWeek[i] = getDaysBetweenDates(new Date(2016,11,15),new Date(2018,1,25),preferedDays[i]);

}

var gamenumber=0;

var numTimeslot = 2;

// # of games (Matchups)close to total of matchups (3*2*2*2)

var time_court_days = 6;

var total_matchups = Math.ceil(matchups.length/time_court_days);

//edit all remove slots if remvoe use removeslots if edit venue ortime  use other



// [] //certain week



// ************ ASSIGN MATCHUPS TO CREATED SCHEDULE SLOTS ************ 

// i = week 

for(var i =0; i< matchups.length;i++){

    // # of prefered days (Mon, Tue)

    for(var k = 0;k<2;k++){

        // # of games per day (timeslots)

        for(var timeslot = 0;timeslot <2;timeslot++){

            // # of games per day (courts)

            for(var courtindex=0; courtindex<2;courtindex++){

                var blockaddress = i+" "+k+" "+timeslot+" "+courtindex;

                // skip certain removed schedule slot

                var scheduleid = timeslot+" "+courtindex;

                

                if(week[i] == i){ //if select certain week 

                 

                    if( scheduleid == removeslots[0] ){

                        continue;

                    }

                }

                     

                if(matchups[gamenumber]!=undefined){

                    schedule.push(

                        {

                            blockaddress:blockaddress,

                            schedid:scheduleid,

                            schedule:dayofWeek[k][i],

                            day:dayofWeek[k][i].substring(0, 3),

                            court:courts[courtindex],

                            timeslot: timeslots[timeslot],

                            game:"Game" +(gamenumber+1),

                            matchup:matchups[gamenumber],

                        }

                    );

                    gamenumber++;

                }

            }

        }

    }

}

schedule;