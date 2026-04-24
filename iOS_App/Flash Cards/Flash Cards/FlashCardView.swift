import SwiftUI

struct FlashCardView: View {
    let card: Card
    @State private var isFlipped = false
    
    var body: some View {
        ZStack {
            // Background Card
            RoundedRectangle(cornerRadius: 25, style: .continuous)
                .fill(
                    LinearGradient(
                        colors: [Color(red: 0.15, green: 0.15, blue: 0.25), Color(red: 0.05, green: 0.05, blue: 0.15)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .shadow(color: .black.opacity(0.3), radius: 15, x: 0, y: 10)
                .overlay(
                    RoundedRectangle(cornerRadius: 25, style: .continuous)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
            
            // Content
            Text(isFlipped ? card.definition : card.term)
                .font(.system(size: isFlipped ? 22 : 36, weight: isFlipped ? .regular : .bold, design: .rounded))
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
                .padding(30)
                // We rotate the text back around the Y axis if the card is flipped, so it doesn't appear backwards
                .rotation3DEffect(.degrees(isFlipped ? 180 : 0), axis: (x: 0, y: 1, z: 0))
        }
        .frame(width: 320, height: 450)
        .rotation3DEffect(
            .degrees(isFlipped ? 180 : 0),
            axis: (x: 0, y: 1, z: 0)
        )
        .onTapGesture {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.8, blendDuration: 0)) {
                isFlipped.toggle()
            }
        }
    }
}

#Preview {
    FlashCardView(card: Card.sampleDeck[0])
}
