import {Prisma} from "@prisma/client";

export interface IGameInstance {
    game_instance: Prisma.th_web_gameGetPayload<{ include: {
            final_word: { select: { human_clue: true, word: true }},
            last_guess: { include: { word: { select: { word: true }}}}
    }}>
    guesses_count: number
}