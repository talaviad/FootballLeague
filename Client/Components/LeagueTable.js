import React from 'react';
import { Table, Row, Rows } from 'react-native-table-component';
import { View, Button, Text, StyleSheet, SafeAreaView, ScrollView, Header } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class LeagueTable extends React.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            tableHead: ['Club', 'MP', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'],
            tableData: navigation.getParam('tableData')
        }
    }

    render() {
        return (
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={styles.container}>
                        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                            <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} />
                            <Rows data={this.state.tableData} textStyle={styles.text} />
                        </Table>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    scrollView: {
        backgroundColor: Colors.lighter,
    }
});