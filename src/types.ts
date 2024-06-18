import {Prisma, TH_GAME_STATUS} from "@prisma/client";

export interface IGameInstance {
    game_instance: Prisma.th_web_gameGetPayload<{ include: {
            final_word: { select: { human_clue: true, word: true }},
            last_guess: { include: { word: { select: { word: true }}}}
    }}>
    guesses_count: number
}

export interface WordStats {
    status: TH_GAME_STATUS
    avg_steps: number
    min_steps: number
    total_plays: number
}