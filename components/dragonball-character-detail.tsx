import { getCharacter } from "../lib/dragonball-api";
import Image from "next/image";

export default async function DragonBallCharacterDetail({ id }: { id: string }) {
  const character = await getCharacter(id);
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative h-80 w-full md:w-1/3 flex-shrink-0">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{character.name}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-gray-400 text-sm">Race</h3>
              <p>{character.race}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Gender</h3>
              <p>{character.gender}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Ki</h3>
              <p>{character.ki}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Affiliation</h3>
              <p>{character.affiliation}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-400 text-sm mb-2">Description</h3>
            <p className="text-sm">{character.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}