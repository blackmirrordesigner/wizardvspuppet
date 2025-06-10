module exampleAddress::RockPaperScissors {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_framework::event;
    use aptos_framework::account;
    use aptos_framework::aptos_coin::AptosCoin;

    // Error codes
    const E_GAME_NOT_FOUND: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_GAME_ALREADY_FULL: u64 = 3;
    const E_NOT_PLAYER: u64 = 4;
    const E_MOVE_ALREADY_SUBMITTED: u64 = 5;
    const E_GAME_NOT_READY: u64 = 6;
    const E_TIME_EXPIRED: u64 = 7;
    const E_TOURNAMENT_NOT_FOUND: u64 = 8;
    const E_TOURNAMENT_FULL: u64 = 9;
    const E_ALREADY_REGISTERED: u64 = 10;

    // Game moves
    const ROCK: u8 = 1;
    const PAPER: u8 = 2;
    const SCISSORS: u8 = 3;

    // Game status
    const WAITING_FOR_PLAYER: u8 = 1;
    const WAITING_FOR_MOVES: u8 = 2;
    const GAME_FINISHED: u8 = 3;

    // Tournament status
    const TOURNAMENT_REGISTRATION: u8 = 1;
    const TOURNAMENT_ACTIVE: u8 = 2;
    const TOURNAMENT_FINISHED: u8 = 3;

    struct Game has key, store {
        id: u64,
        player1: address,
        player2: address,
        bet_amount: u64,
        player1_move: u8,
        player2_move: u8,
        player1_move_hash: vector<u8>,
        player2_move_hash: vector<u8>,
        winner: address,
        status: u8,
        created_at: u64,
        move_deadline: u64,
    }

    struct Tournament has key, store {
        id: u64,
        name: vector<u8>,
        entry_fee: u64,
        prize_pool: u64,
        participants: vector<address>,
        max_participants: u64,
        status: u8,
        start_time: u64,
        current_round: u64,
        bracket: vector<vector<address>>,
    }

    struct GameStore has key {
        games: vector<Game>,
        next_game_id: u64,
        house_balance: u64,
    }

    struct TournamentStore has key {
        tournaments: vector<Tournament>,
        next_tournament_id: u64,
        weekly_pool: u64,
    }

    // Events
    struct GameCreatedEvent has drop, store {
        game_id: u64,
        creator: address,
        bet_amount: u64,
    }

    struct GameJoinedEvent has drop, store {
        game_id: u64,
        player2: address,
    }

    struct MoveSubmittedEvent has drop, store {
        game_id: u64,
        player: address,
    }

    struct GameFinishedEvent has drop, store {
        game_id: u64,
        winner: address,
        prize_amount: u64,
    }

    struct TournamentCreatedEvent has drop, store {
        tournament_id: u64,
        name: vector<u8>,
        entry_fee: u64,
    }

    struct TournamentJoinedEvent has drop, store {
        tournament_id: u64,
        player: address,
    }

    // Initialize the module
    fun init_module(account: &signer) {
        move_to(account, GameStore {
            games: vector::empty<Game>(),
            next_game_id: 1,
            house_balance: 0,
        });

        move_to(account, TournamentStore {
            tournaments: vector::empty<Tournament>(),
            next_tournament_id: 1,
            weekly_pool: 0,
        });
    }

    // Create a new game
    public entry fun create_game(player: &signer, bet_amount: u64) acquires GameStore {
        let player_addr = signer::address_of(player);
        
        // Check if player has sufficient balance
        assert!(coin::balance<AptosCoin>(player_addr) >= bet_amount, E_INSUFFICIENT_BALANCE);
        
        // Transfer bet to contract
        coin::transfer<AptosCoin>(player, @exampleAddress, bet_amount);
        
        let game_store = borrow_global_mut<GameStore>(@exampleAddress);
        let game_id = game_store.next_game_id;
        
        let new_game = Game {
            id: game_id,
            player1: player_addr,
            player2: @0x0,
            bet_amount,
            player1_move: 0,
            player2_move: 0,
            player1_move_hash: vector::empty(),
            player2_move_hash: vector::empty(),
            winner: @0x0,
            status: WAITING_FOR_PLAYER,
            created_at: timestamp::now_seconds(),
            move_deadline: 0,
        };
        
        vector::push_back(&mut game_store.games, new_game);
        game_store.next_game_id = game_id + 1;
        
        event::emit(GameCreatedEvent {
            game_id,
            creator: player_addr,
            bet_amount,
        });
    }

    // Join an existing game
    public entry fun join_game(player: &signer, game_id: u64) acquires GameStore {
        let player_addr = signer::address_of(player);
        let game_store = borrow_global_mut<GameStore>(@exampleAddress);
        
        let game_ref = find_game_mut(&mut game_store.games, game_id);
        assert!(game_ref.status == WAITING_FOR_PLAYER, E_GAME_ALREADY_FULL);
        assert!(coin::balance<AptosCoin>(player_addr) >= game_ref.bet_amount, E_INSUFFICIENT_BALANCE);
        
        // Transfer bet to contract
        coin::transfer<AptosCoin>(player, @exampleAddress, game_ref.bet_amount);
        
        game_ref.player2 = player_addr;
        game_ref.status = WAITING_FOR_MOVES;
        game_ref.move_deadline = timestamp::now_seconds() + 30; // 30 second deadline
        
        event::emit(GameJoinedEvent {
            game_id,
            player2: player_addr,
        });
    }

    // Submit move (with commit-reveal scheme for fairness)
    public entry fun submit_move_hash(player: &signer, game_id: u64, move_hash: vector<u8>) acquires GameStore {
        let player_addr = signer::address_of(player);
        let game_store = borrow_global_mut<GameStore>(@exampleAddress);
        
        let game_ref = find_game_mut(&mut game_store.games, game_id);
        assert!(game_ref.status == WAITING_FOR_MOVES, E_GAME_NOT_READY);
        assert!(timestamp::now_seconds() <= game_ref.move_deadline, E_TIME_EXPIRED);
        
        if (player_addr == game_ref.player1) {
            assert!(vector::is_empty(&game_ref.player1_move_hash), E_MOVE_ALREADY_SUBMITTED);
            game_ref.player1_move_hash = move_hash;
        } else if (player_addr == game_ref.player2) {
            assert!(vector::is_empty(&game_ref.player2_move_hash), E_MOVE_ALREADY_SUBMITTED);
            game_ref.player2_move_hash = move_hash;
        } else {
            abort E_NOT_PLAYER
        };
        
        event::emit(MoveSubmittedEvent {
            game_id,
            player: player_addr,
        });
    }

    // Reveal move
    public entry fun reveal_move(player: &signer, game_id: u64, move: u8, nonce: u64) acquires GameStore {
        let player_addr = signer::address_of(player);
        let game_store = borrow_global_mut<GameStore>(@exampleAddress);
        
        let game_ref = find_game_mut(&mut game_store.games, game_id);
        
        // Verify move is valid
        assert!(move >= ROCK && move <= SCISSORS, 0);
        
        // TODO: Verify hash matches move + nonce
        
        if (player_addr == game_ref.player1) {
            game_ref.player1_move = move;
        } else if (player_addr == game_ref.player2) {
            game_ref.player2_move = move;
        } else {
            abort E_NOT_PLAYER
        };
        
        // Check if both moves are revealed
        if (game_ref.player1_move != 0 && game_ref.player2_move != 0) {
            finish_game(game_ref);
        };
    }

    // Finish game and distribute winnings
    fun finish_game(game: &mut Game) acquires GameStore {
        let winner = determine_winner(game.player1_move, game.player2_move);
        let total_pot = game.bet_amount * 2;
        let house_fee = total_pot / 100; // 1% fee
        let winner_amount = total_pot - house_fee;
        
        game.status = GAME_FINISHED;
        
        let game_store = borrow_global_mut<GameStore>(@exampleAddress);
        game_store.house_balance = game_store.house_balance + house_fee;
        
        if (winner == 1) {
            game.winner = game.player1;
            coin::transfer<AptosCoin>(&account::create_signer_with_capability(&account::create_test_signer_cap(@exampleAddress)), game.player1, winner_amount);
        } else if (winner == 2) {
            game.winner = game.player2;
            coin::transfer<AptosCoin>(&account::create_signer_with_capability(&account::create_test_signer_cap(@exampleAddress)), game.player2, winner_amount);
        } else {
            // Tie - return bets
            coin::transfer<AptosCoin>(&account::create_signer_with_capability(&account::create_test_signer_cap(@exampleAddress)), game.player1, game.bet_amount);
            coin::transfer<AptosCoin>(&account::create_signer_with_capability(&account::create_test_signer_cap(@exampleAddress)), game.player2, game.bet_amount);
        };
        
        event::emit(GameFinishedEvent {
            game_id: game.id,
            winner: game.winner,
            prize_amount: if (winner == 0) { 0 } else { winner_amount },
        });
    }

    // Determine winner: 1 = player1, 2 = player2, 0 = tie
    fun determine_winner(move1: u8, move2: u8): u8 {
        if (move1 == move2) {
            0 // Tie
        } else if (
            (move1 == ROCK && move2 == SCISSORS) ||
            (move1 == PAPER && move2 == ROCK) ||
            (move1 == SCISSORS && move2 == PAPER)
        ) {
            1 // Player 1 wins
        } else {
            2 // Player 2 wins
        }
    }

    // Create tournament
    public entry fun create_tournament(
        admin: &signer,
        name: vector<u8>,
        entry_fee: u64,
        max_participants: u64,
        start_time: u64
    ) acquires TournamentStore {
        let tournament_store = borrow_global_mut<TournamentStore>(@exampleAddress);
        let tournament_id = tournament_store.next_tournament_id;
        
        let new_tournament = Tournament {
            id: tournament_id,
            name,
            entry_fee,
            prize_pool: 0,
            participants: vector::empty(),
            max_participants,
            status: TOURNAMENT_REGISTRATION,
            start_time,
            current_round: 0,
            bracket: vector::empty(),
        };
        
        vector::push_back(&mut tournament_store.tournaments, new_tournament);
        tournament_store.next_tournament_id = tournament_id + 1;
        
        event::emit(TournamentCreatedEvent {
            tournament_id,
            name,
            entry_fee,
        });
    }

    // Join tournament
    public entry fun join_tournament(player: &signer, tournament_id: u64) acquires TournamentStore {
        let player_addr = signer::address_of(player);
        let tournament_store = borrow_global_mut<TournamentStore>(@exampleAddress);
        
        let tournament_ref = find_tournament_mut(&mut tournament_store.tournaments, tournament_id);
        assert!(tournament_ref.status == TOURNAMENT_REGISTRATION, E_TOURNAMENT_NOT_FOUND);
        assert!(vector::length(&tournament_ref.participants) < tournament_ref.max_participants, E_TOURNAMENT_FULL);
        assert!(!vector::contains(&tournament_ref.participants, &player_addr), E_ALREADY_REGISTERED);
        assert!(coin::balance<AptosCoin>(player_addr) >= tournament_ref.entry_fee, E_INSUFFICIENT_BALANCE);
        
        // Transfer entry fee
        coin::transfer<AptosCoin>(player, @exampleAddress, tournament_ref.entry_fee);
        
        vector::push_back(&mut tournament_ref.participants, player_addr);
        tournament_ref.prize_pool = tournament_ref.prize_pool + tournament_ref.entry_fee;
        
        event::emit(TournamentJoinedEvent {
            tournament_id,
            player: player_addr,
        });
    }

    // Helper functions
    fun find_game_mut(games: &mut vector<Game>, game_id: u64): &mut Game {
        let i = 0;
        let len = vector::length(games);
        while (i < len) {
            let game = vector::borrow_mut(games, i);
            if (game.id == game_id) {
                return game
            };
            i = i + 1;
        };
        abort E_GAME_NOT_FOUND
    }

    fun find_tournament_mut(tournaments: &mut vector<Tournament>, tournament_id: u64): &mut Tournament {
        let i = 0;
        let len = vector::length(tournaments);
        while (i < len) {
            let tournament = vector::borrow_mut(tournaments, i);
            if (tournament.id == tournament_id) {
                return tournament
            };
            i = i + 1;
        };
        abort E_TOURNAMENT_NOT_FOUND
    }

    // View functions
    #[view]
    public fun get_game(game_id: u64): Game acquires GameStore {
        let game_store = borrow_global<GameStore>(@exampleAddress);
        *find_game(&game_store.games, game_id)
    }

    fun find_game(games: &vector<Game>, game_id: u64): &Game {
        let i = 0;
        let len = vector::length(games);
        while (i < len) {
            let game = vector::borrow(games, i);
            if (game.id == game_id) {
                return game
            };
            i = i + 1;
        };
        abort E_GAME_NOT_FOUND
    }

    #[view]
    public fun get_house_balance(): u64 acquires GameStore {
        let game_store = borrow_global<GameStore>(@exampleAddress);
        game_store.house_balance
    }

    #[view]
    public fun get_tournament_pool(): u64 acquires TournamentStore {
        let tournament_store = borrow_global<TournamentStore>(@exampleAddress);
        tournament_store.weekly_pool
    }
}
