module kryptonite_nft::kryptonite_nft {

    use std::string;
    use iota::object;
    use iota::tx_context::{TxContext};

    struct NFT has key, store {
        id: object::UID,
        name: string::String,
        description: string::String,
        image_url: string::String,
    }

    fun init(ctx: &mut TxContext) {
        // REQUIRED even if empty
    }

    public fun mint_to_sender(
        name: string::String,
        description: string::String,
        image_url: string::String,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name,
            description,
            image_url,
        };

        transfer::transfer(nft, tx_context::sender(ctx));
    }
}
