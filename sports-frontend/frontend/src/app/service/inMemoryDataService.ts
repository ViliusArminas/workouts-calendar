import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemDataService implements InMemoryDbService {
    createDb(): {} {
        return {
            tournamentsList: [
                {
                    id: 1,
                    tournamentId: '173',
                    name: 'Kalėdinis turnyras',
                    status: 'Open to registration',
                    membersRegistred: 5,
                    registered: false,
                    winner: '-'
                },
                {
                    id: 2,
                    tournamentId: '174',
                    name: 'Dėstytoju ir studentu dvikovos',
                    status: 'In progress',
                    membersRegistred: 4,
                    registered: false,
                    winner: '-'
                },
                {
                    id: 3,
                    tournamentId: '175',
                    name: 'Nugaletojas prie galutinio 0.5',
                    status: 'Open to registration',
                    membersRegistred: 120,
                    registered: false,
                    winner: '-'
                },
                {
                    id: 4,
                    tournamentId: '176',
                    name: 'Helouvynas 2017',
                    status: 'Finished',
                    membersRegistred: 20,
                    registered: false,
                    winner: 'SaslykuVartytojai'
                },
            ],
            playerRatings: [
                {
                    id: 1,
                    rating: 1,
                    points: 103,
                    name: 'Lina',
                    wins: 10,
                    looses: 3,
                    tournamentsPlayed: 3
                },
                {
                    id: 2,
                    rating: 2,
                    points: 69,
                    name: 'Kristina',
                    wins: 10,
                    looses: 6,
                    tournamentsPlayed: 4
                },
                {
                    id: 3,
                    rating: 3,
                    points: 25,
                    name: 'Mantas',
                    wins: 4,
                    looses: 5,
                    tournamentsPlayed: 2
                },
            ],
            playersList: [
                {
                    id: 1,
                    name: 'Vilius'
                },
                {
                    id: 2,
                    name: 'Saulius'
                },
                {
                    id: 3,
                    name: 'Zygimantas'
                },
                {
                    id: 4,
                    name: 'Mantas'
                },
                {
                    id: 5,
                    name: 'Lina'
                },
                {
                    id: 6,
                    name: 'Kristina'
                },
            ],
            teamsList: [
                {
                    id: 1,
                    teamName: 'Give money please',
                    members: [
                        { name: 'Vilius' },
                        { name: 'Mantas' },
                        { name: 'Zygimantas' },
                        { name: 'Saulius' },
                    ]
                },
            ],
            betsList: [
                {
                    id: 1,
                    gameId: 169,
                    player1: 'Kristina',
                    player2: 'Lina',
                    betOn: 'Kristina',
                    game1: '10 - 8',
                    game2: '6 - 10',
                    game3: '10 - 4',
                    betAmount: 25,
                    betWon: true
                },
                {
                    id: 2,
                    gameId: 170,
                    player1: 'Zygimantas',
                    player2: 'Saulius',
                    betOn: 'Zygimantas',
                    game1: '8 - 10',
                    game2: '7 - 10',
                    game3: '10 - 5',
                    betAmount: 20,
                    betWon: false
                },
                {
                    id: 3,
                    gameId: 171,
                    player1: 'Mantas',
                    player2: 'Vilius',
                    betOn: 'Mantas',
                    game1: '10 - 9',
                    game2: '8 - 10',
                    game3: '10 - 6',
                    betAmount: 25,
                    betWon: true
                }
            ],
            playerStats: {
                id: 1,
                rating: 3,
                points: 25,
                wins: 4,
                looses: 5,
                tournamentsPlayed: 2,
                betsWon: 2,
                betsLost: 1,
                totalCashWon: 100,
                totalCashLost: 40
            }
        };

    }
}
