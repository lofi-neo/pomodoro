import Foundation

struct Card: Identifiable {
    let id = UUID()
    let term: String
    let definition: String
}

extension Card {
    static let sampleDeck: [Card] = [
        Card(term: "SwiftUI", definition: "A declarative framework for building user interfaces on Apple platforms."),
        Card(term: "State", definition: "A property wrapper type that can read and write a value managed by SwiftUI."),
        Card(term: "Binding", definition: "A property wrapper type that can read and write a value owned by a source of truth."),
        Card(term: "ZStack", definition: "A view that overlays its children, aligning them in both axes."),
        Card(term: "ViewModifier", definition: "A modifier that you apply to a view or another view modifier, producing a different version of the original value.")
    ]
}
