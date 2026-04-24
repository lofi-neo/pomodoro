import SwiftUI

struct ContentView: View {
    @State private var deck = Card.sampleDeck
    @State private var currentIndex = 0
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack {
                Text("Flash Cards")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding(.top, 40)
                
                Spacer()
                
                if !deck.isEmpty {
                    FlashCardView(card: deck[currentIndex])
                        // Reset flip state when card changes
                        .id(deck[currentIndex].id)
                } else {
                    Text("No cards available")
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                HStack(spacing: 40) {
                    Button(action: previousCard) {
                        Image(systemName: "chevron.left.circle.fill")
                            .font(.system(size: 50))
                            .foregroundColor(currentIndex > 0 ? .blue : .gray.opacity(0.3))
                    }
                    .disabled(currentIndex == 0)
                    
                    Text("\(currentIndex + 1) / \(deck.count)")
                        .font(.headline)
                        .foregroundColor(.gray)
                    
                    Button(action: nextCard) {
                        Image(systemName: "chevron.right.circle.fill")
                            .font(.system(size: 50))
                            .foregroundColor(currentIndex < deck.count - 1 ? .blue : .gray.opacity(0.3))
                    }
                    .disabled(currentIndex == deck.count - 1)
                }
                .padding(.bottom, 50)
            }
        }
    }
    
    private func nextCard() {
        if currentIndex < deck.count - 1 {
            withAnimation {
                currentIndex += 1
            }
        }
    }
    
    private func previousCard() {
        if currentIndex > 0 {
            withAnimation {
                currentIndex -= 1
            }
        }
    }
}

#Preview {
    ContentView()
}
