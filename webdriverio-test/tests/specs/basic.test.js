describe('Lodgify contact page', () => {
    it('should have the right title', () => {
        browser.url('http://localhost:8080/Contact.html')
        expect(browser).toHaveTitle('Contact');
    })
})